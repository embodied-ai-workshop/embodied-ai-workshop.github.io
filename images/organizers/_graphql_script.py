"""Wrote the graphql query without manually going one-by-one to enter each."""
import os

organizers = [o for o in os.listdir() if o.endswith(".jpg")]
for name in sorted(organizers):
    print(
        f'    {name[:-len(".jpg")]}Org: file(relativePath: {{ eq: "organizers/{name}" }}) {{',
        "  ...OrganizerImage",
        "}",
        sep="\n    ",
    )


organizers = [
    {"name": "Aaron Gokaslan", "organization": "FAIR"},
    {"name": "Alex Ku", "organization": "Google"},
    {"name": "Alexander Toshev", "organization": "Google"},
    {"name": "Ali Farhadi", "organization": "UW"},
    {"name": "Andrew Westbury", "organization": "FAIR"},
    {"name": "Angel X. Chang", "organization": "SFU"},
    {"name": "Aniruddha Kembhavi", "organization": "AI2, UW"},
    {"name": "Anthony Francis", "organization": "Google"},
    {"name": "Antonio M. Lopez", "organization": "UAB-CVC"},
    {"name": "Ben Talbot", "organization": "QUT, ACRV, QCR"},
    {"name": "Changan Chen", "organization": "UT Austin, FAIR"},
    {"name": "Chengshu Li", "organization": "Stanford"},
    {"name": "Chuang Gan", "organization": "MIT"},
    {
        "name": "David Hall ",
        "organization": "QUT, ACRV, QCR",
    },
    {"name": "Devi Parikh", "organization": "FAIR, Georgia Tech"},
    {"name": "Dhruv Batra", "organization": "FAIR, Georgia Tech"},
    {"name": "Eric Kolve", "organization": "AI2"},
    {"name": "Erik Wijmans", "organization": "Georgia Tech"},
    {"name": "Fei Xia", "organization": "Stanford"},
    {"name": "Fei-Fei Li", "organization": "Stanford"},
    {
        "name": "Feras Dayoub",
        "organization": "QUT, ACRV, QCR",
    },
    {"name": "German Ros", "organization": "Intel"},
    {
        "name": "Haoyang Zhang",
        "organization": "QUT, ACRV, QCR",
    },
    {"name": "Jacob Krantz", "organization": "Oregon State"},
    {"name": "Jaewoo Jang", "organization": "Stanford"},
    {"name": "Jesse Thomason", "organization": "USC"},
    {"name": "Jitendra Malik", "organization": "FAIR, UC Berkeley"},
    {"name": "Joanne Truong", "organization": "Georgia Tech"},
    {"name": "Jose A. Iglesias-Guitian", "organization": "UDC-CITIC"},
    {"name": "Jose M. Alvarez", "organization": "NVIDIA"},
    {"name": "Josh Tenenbaum", "organization": "MIT"},
    {"name": "Kristen Grauman", "organization": "UT Austin, FAIR"},
    {"name": "Luca Weihs", "organization": "AI2"},
    {"name": "Manolis Savva", "organization": "SFU"},
    {"name": "Matt Deitke", "organization": "AI2, UW"},
    {"name": "Mohit Shridhar", "organization": "UW"},
    {
        "name": "Niko Sünderhauf",
        "organization": "QUT, ACRV, QCR",
    },
    {"name": "Oleksandr Maksymets", "organization": "FAIR"},
    {"name": "Peter Anderson", "organization": "Google"},
    {"name": "Rishabh  Jain", "organization": "Georgia Tech"},
    {"name": "Roberto Martín-Martín", "organization": "Stanford"},
    {
        "name": "Rohan Smith",
        "organization": "QUT, ACRV, QCR",
    },
    {"name": "Roozbeh Mottaghi", "organization": "AI2, UW"},
    {"name": "Saim Wani", "organization": "IIT Kanpur"},
    {"name": "Shivansh Patel", "organization": "IIT Kanpur, SFU"},
    {"name": "Silvio Savarese", "organization": "Stanford"},
    {"name": "Sonia Chernova", "organization": "Georgia Tech"},
    {"name": "Stefan Lee", "organization": "Oregon State"},
    {
        "name": "Suman Bista",
        "organization": "QUT, ACRV, QCR",
    },
    {"name": "Unnat Jain", "organization": "UIUC"},
    {"name": "Vladlen Koltun", "organization": "Intel"},
    {"name": "Winson Han", "organization": "AI2"},
    {"name": "Yonatan Bisk", "organization": "CMU"},
]