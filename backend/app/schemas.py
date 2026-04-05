from pydantic import BaseModel, Field, validator, constr
from datetime import datetime
from typing import Optional

class CategoryBase(BaseModel):
    name: constr(min_length=1, max_length=50)

class CategoryCreate(CategoryBase):
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Category name cannot be empty or whitespace')
        return v.strip().title()

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ExpenseBase(BaseModel):
    amount: float = Field(..., gt=0)
    description: constr(min_length=1, max_length=200)
    date: datetime = Field(default_factory=datetime.utcnow)
    category_id: int = Field(..., gt=0)

    @validator('description')
    def validate_description(cls, v):
        if not v.strip():
            raise ValueError('Description cannot be empty')
        return v.strip()

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    category_name: str
    created_at: datetime

    class Config:
        orm_mode = True

class MonthlySummary(BaseModel):
    month: str
    total: float
    category_breakdown: dict
    expense_count: int