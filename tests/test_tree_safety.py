"""The publish job packages plugin trees on an internal machine and uploads the
result to a public CDN. These tests pin the two properties that keep that from
becoming a file-disclosure primitive: symlinks are refused (not followed, not
silently skipped) and plugin sources cannot point outside plugins/.
"""

from __future__ import annotations

import importlib.util
import os
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def load(name: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / "scripts" / f"{name}.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


validate = load("validate")
build_dist = load("build_dist")


class SymlinkRefusalTest(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(tempfile.mkdtemp(prefix="tree-safety-"))
        self.plugin = self.root / "my-plugin"
        (self.plugin / ".zcode-plugin").mkdir(parents=True)
        (self.plugin / ".zcode-plugin" / "plugin.json").write_text("{}", encoding="utf-8")
        (self.plugin / "README.md").write_text("hi", encoding="utf-8")
        self.secret = self.root / "outside-secret.txt"
        self.secret.write_text("AKIA-not-for-the-cdn", encoding="utf-8")

    def test_clean_tree_passes_and_packages(self) -> None:
        self.assertEqual(validate.tree_violations(self.plugin, "p"), [])
        out = self.root / "plugin.zip"
        build_dist.build_zip(self.plugin, out)
        self.assertTrue(out.is_file())

    def test_file_symlink_is_rejected_by_validator_and_builder(self) -> None:
        os.symlink(self.secret, self.plugin / "leak.txt")
        problems = validate.tree_violations(self.plugin, "p")
        self.assertTrue(any("leak.txt is a symlink" in p for p in problems), problems)
        with self.assertRaises(build_dist.UnsafeTree):
            build_dist.build_zip(self.plugin, self.root / "plugin.zip")

    def test_directory_symlink_is_rejected(self) -> None:
        outside = self.root / "outside-dir"
        outside.mkdir()
        (outside / "config").write_text("x", encoding="utf-8")
        os.symlink(outside, self.plugin / "nested")
        problems = validate.tree_violations(self.plugin, "p")
        self.assertTrue(any("nested is a symlink" in p for p in problems), problems)
        with self.assertRaises(build_dist.UnsafeTree):
            build_dist.regular_files(self.plugin)

    def test_plugin_root_symlink_is_rejected(self) -> None:
        link = self.root / "linked-plugin"
        os.symlink(self.plugin, link)
        self.assertEqual(validate.tree_violations(link, "p"), ["p: directory is a symlink"])
        with self.assertRaises(build_dist.UnsafeTree):
            build_dist.regular_files(link)


class RepositoryTreeTest(unittest.TestCase):
    def test_current_repository_has_no_symlinks_in_published_trees(self) -> None:
        for name in ("plugins", "assets"):
            self.assertEqual(validate.tree_violations(ROOT / name, name), [])

    def test_github_workflows_pin_read_only_token(self) -> None:
        for wf in ("validate.yml", "pr-title.yml", "publish.yml"):
            text = (ROOT / ".github" / "workflows" / wf).read_text(encoding="utf-8")
            with self.subTest(workflow=wf):
                self.assertIn("permissions:", text)
                self.assertNotIn("pull_request_target", text)


if __name__ == "__main__":
    unittest.main()
