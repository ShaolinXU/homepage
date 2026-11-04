---
title: "Does @app.delete in FastAPI actually delete anything?"
date: 2025-07-09
summary: "@app.delete only declares a handler for DELETE requests. Whether data is deleted, and what else happens, is up to your code."
tags: [fastapi, python]
---

Learning FastAPI, I had two questions: after `@app.delete` runs, has the resource really been "deleted"? And can the same function still add new content afterwards?

## What `@app.delete` is

- `@app.delete(...)` is a FastAPI decorator that declares **which function handles HTTP DELETE requests** for a path.
- It only binds the path to the function; what happens inside is entirely up to you.
- It **does not delete anything by itself**.

So `@app.delete` is not an automatic delete: the deletion has to be written in the function body, for example `del students[student_id]`.

## Can you add data after deleting?

Yes. The handler can do anything: write a log, append to another data structure, call an external system, or even put the deleted item back (rare).

## Example: log the deleted record

```python
@app.delete("/delete-student/{student_id}")
def delete_student(student_id: int):
    if student_id not in students:
        raise HTTPException(status_code=404, detail="Student does not exist")

    # get the record before deleting it
    deleted_student = students[student_id]

    # delete the student
    del students[student_id]

    # keep a copy in a separate "deleted students" dictionary
    deleted_log[student_id] = deleted_student

    return {"message": "Student deleted and logged successfully"}
```

The function first removes the original data and then adds new content (`deleted_log`); the two do not conflict.

## Why it is designed this way

FastAPI's idea is: **you control the logic, the framework provides the interface**. Unlike Django's generic views, it does not apply default behaviour to your models for you. That gives you flexibility, at the cost of writing the logic yourself.

## Summary

| Question | Answer |
|---|---|
| Does `@app.delete` delete data automatically? | No, the logic is yours |
| Can you add data after deleting? | Yes, e.g. logging, backups or new records |
| Does a DELETE handler limit what you can do? | No, any Python logic is allowed |
