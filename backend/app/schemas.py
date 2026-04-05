from pydantic import BaseModel, Field, validator
from datetime import datetime

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    @validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Category name cannot be empty')
        if len(v.strip()) > 50:
            raise ValueError('Category name too long')
        return v.strip().title()

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ExpenseBase(BaseModel):
    amount: float
    description: str
    date: datetime = Field(default_factory=datetime.utcnow)
    category_id: int

    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Amount must be greater than 0')
        return v

    @validator('description')
    def validate_description(cls, v):
        if not v or not v.strip():
            raise ValueError('Description cannot be empty')
        if len(v.strip()) > 200:
            raise ValueError('Description too long')
        return v.strip()

    @validator('category_id')
    def validate_category_id(cls, v):
        if v <= 0:
            raise ValueError('Invalid category')
        return v

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