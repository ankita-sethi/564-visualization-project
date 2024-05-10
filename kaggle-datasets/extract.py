import pandas as pd

# Read the CSV file
# df = pd.read_csv("sustainable_development_report_2023.csv")

# # Rename columns
# rename_columns = {
#     'overall_score': 'sustainable_index_score',
#     'goal_1_score': 'no_poverty_score',
#     'goal_2_score': 'zero_hunger_score', 
#     'goal_3_score': 'good_health_score', 
#     'goal_4_score': 'quality_education_score', 
#     'goal_5_score': 'gender_equality_score',
#     'goal_6_score': 'clean_water_sanitation_score', 
#     'sdg_index_score': 'sustainable_index_score'
# }
# df.rename(columns=rename_columns, inplace=True)
# target_year = 2023
# df['year'] = target_year

# # Remove columns
# columns_to_remove = ["country_code", "region", "goal_7_score", "goal_8_score", "goal_9_score",
#                      "goal_10_score", "goal_11_score", "goal_12_score", "goal_13_score",
#                      "goal_14_score", "goal_15_score", "goal_16_score", "goal_17_score"]
# df.drop(columns=columns_to_remove, inplace=True)

# df1 = pd.read_csv("sdg_index_2000-2022.csv")

# target_year = [2016,2017,2018,2019,2020,2021,2022]

# # Explicitly create a copy to avoid the SettingWithCopyWarning
# df_filtered = df1[df1['year'].isin(target_year)].copy()

# df_filtered.rename(columns=rename_columns, inplace=True)

# columns_to_remove = ["country_code", "goal_7_score", "goal_8_score", "goal_9_score",
#                      "goal_10_score", "goal_11_score", "goal_12_score", "goal_13_score",
#                      "goal_14_score", "goal_15_score", "goal_16_score", "goal_17_score"]
# df_filtered.drop(columns=columns_to_remove, inplace=True)

# # Now you have the DataFrame with renamed and removed columns
# # print(df.columns, df_filtered.columns)

# merged_df = pd.concat([df, df_filtered])

# # Sort the merged data frame by 'country' column alphabetically and 'year' column numerically
# sorted_df = merged_df.sort_values(by=['country', 'year'])

# # Reset index after sorting
# sorted_df.reset_index(drop=True, inplace=True)
# sorted_df.dropna(inplace=True)

# # Now sorted_df contains the merged data frames with rows sorted by 'country' column alphabetically and 'year' column numerically
# # print(sorted_df.columns)

# df3 = pd.read_csv("WHR_2023.csv")
# target_year = 2023
# df3['year'] = target_year
# df4 = pd.read_csv("WHR_2018.csv")
# target_year = 2018
# df4['year'] = target_year

# df5 = pd.read_csv("WHR_2016.csv")
# target_year = 2016
# df5['year'] = target_year

# df6 = pd.read_csv("WHR_2017.csv")
# target_year = 2017
# df6['year'] = target_year

# df7 = pd.read_csv("WHR_2019.csv")
# target_year = 2019
# df7['year'] = target_year

# df8 = pd.read_csv("WHR_2020.csv")
# target_year = 2020
# df8['year'] = target_year

# df9 = pd.read_csv("WHR_2021.csv")
# target_year = 2021
# df9['year'] = target_year

# df10 = pd.read_csv("WHR_2022.csv")
# target_year = 2022
# df10['year'] = target_year

# columns_to_remove = ["region"]
# df3.drop(columns=columns_to_remove, inplace=True)
# df4.drop(columns=columns_to_remove, inplace=True)
# df5.drop(columns=columns_to_remove, inplace=True)
# df6.drop(columns=columns_to_remove, inplace=True)
# df7.drop(columns=columns_to_remove, inplace=True)
# df8.drop(columns=columns_to_remove, inplace=True)
# df9.drop(columns=columns_to_remove, inplace=True)
# df10.drop(columns=columns_to_remove, inplace=True)

# merged_df_2 = pd.concat([df3, df4, df5,df6,df7,df8,df9,df10])
# sorted_df_2 = merged_df_2.sort_values(by=['country', 'year'])

# sorted_df_2.reset_index(drop=True, inplace=True)
# sorted_df_2.dropna(inplace=True)

# final_df = pd.merge(sorted_df, sorted_df_2, on=['country', 'year'])


# final_df = final_df[['country', 'year'] + [col for col in final_df.columns if col not in ['country', 'year']]]
# final_df.reset_index(drop=True, inplace=True)
# # Reset the index

# # Now merged_df contains the merged data frames with columns from both data frames, 
# # matched based on 'country' and 'year', and the index is reset

# country_counts = final_df.groupby('country').size()

# # Get the list of countries that have both 2018 and 2023 data
# countries_with_both_years = country_counts[country_counts == 8].index.tolist()

# # Filter the final dataset to include only the countries with data for both years
# final_df_filtered = final_df[final_df['country'].isin(countries_with_both_years)]

# final_df_filtered.to_csv('sustainable-score.csv', index=False)



# df_flags = pd.read_csv("flags_iso.csv")
# columns_to_remove = ["Alpha-3 code", "Alpha-2 code"]
# rename_columns = {
#     'Country': 'country',
# }
# df_flags.rename(columns=rename_columns, inplace=True)
# df_flags.drop(columns=columns_to_remove, inplace=True)

# Read the CSV file
df_data = pd.read_csv("sustainable-score.csv")

# Iterate through unique years
for year in df_data['year'].unique():
    # Filter data for the current year
    df_year = df_data[df_data['year'] == year]
    
    # Create filename for the current year
    filename = f"sustainable-score-{year}.csv"
    
    # Save data to the file
    df_year.to_csv(filename, index=False)
