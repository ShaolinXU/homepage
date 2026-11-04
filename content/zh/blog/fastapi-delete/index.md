---
title: "FastAPI 的 @app.delete 真的会删除数据吗？"
date: 2025-07-09
summary: "@app.delete 只是声明一个处理 DELETE 请求的函数，删不删数据、删完做什么，都由你自己写。"
tags: [fastapi, python]
---

学 FastAPI 时我有两个疑问：调用 `@app.delete` 之后，资源是不是真的被“删除”了？删除之后，还能在同一个函数里继续添加新内容吗？

## `@app.delete` 是什么

- `@app.delete(...)` 是 FastAPI 提供的装饰器，用来声明某个路径的 **HTTP DELETE 请求由哪个函数处理**。
- 它只是把路径和函数绑定在一起，具体做什么完全由函数体决定。
- 它**不会自动删除任何数据**。

所以 `@app.delete` 不等于“自动删除”：真正的删除必须自己写在函数体里，比如 `del students[student_id]`。

## 删除之后还能添加数据吗

完全可以。处理函数里可以做任何事，包括记录日志、给别的数据结构追加内容、向外部系统发请求，甚至把刚删掉的数据再放回去（不常见）。

## 例子：删除后记录到“已删除”列表

```python
@app.delete("/delete-student/{student_id}")
def delete_student(student_id: int):
    if student_id not in students:
        raise HTTPException(status_code=404, detail="Student does not exist")

    # 先取出要删除的学生信息
    deleted_student = students[student_id]

    # 删除该学生
    del students[student_id]

    # 把该学生信息记录到另一个“已删除学生”字典
    deleted_log[student_id] = deleted_student

    return {"message": "Student deleted and logged successfully"}
```

这里先删除了原有数据，又添加了新内容（写入 `deleted_log`），两件事互不冲突。

## 为什么这样设计

FastAPI 的思路是：**逻辑由你控制，框架只提供接口**。它不像 Django 的通用视图那样替你对模型做默认处理，所以灵活性更高，代价是该写的逻辑都要自己写。

## 小结

| 问题 | 回答 |
|---|---|
| `@app.delete` 会自动删除数据吗？ | 不会，逻辑由你定义 |
| 删除后还能添加数据吗？ | 可以，比如记录日志、备份或写入新数据 |
| DELETE 处理函数对内容有限制吗？ | 没有，可以执行任意 Python 逻辑 |
