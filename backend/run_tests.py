import pytest
import sys
import os

if __name__ == "__main__":
    # Add current directory to path
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    
    # Run pytest
    pytest.main(["-v", "app/tests/"])