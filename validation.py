import pandas as pd

def check_for_nan(df):
    # Check if any NaN values are present in the DataFrame
    if df.isna().any().any():
        return True
    else:
        return False

# Example usage:
df = pd.read_csv("sustainable-score.csv")
has_nan = check_for_nan(df)
print(has_nan)
