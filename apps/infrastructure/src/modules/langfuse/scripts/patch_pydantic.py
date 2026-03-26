"""
Patch pydantic v1 for Python 3.14 (PEP 649 deferred annotations).

Import this module before importing any pydantic v1 models (e.g., langfuse).
"""

import annotationlib

import pydantic.v1.main as pydantic_main

_orig = pydantic_main.ModelMetaclass.__new__


def _patched(mcs, name, bases, ns, **kw):
    if not ns.get("__annotations__") and "__annotate_func__" in ns:
        try:
            ns["__annotations__"] = ns["__annotate_func__"](annotationlib.Format.VALUE)
        except Exception:
            pass
    return _orig(mcs, name, bases, ns, **kw)


pydantic_main.ModelMetaclass.__new__ = staticmethod(_patched)
