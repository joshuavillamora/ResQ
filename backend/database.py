from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Neon Postgres connection string
DATABASE_URL = "postgresql+psycopg://neondb_owner:npg_Ho4TdQghGW3K@ep-dawn-cherry-a1plwd6y-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Session for queries
SessionLocal = sessionmaker(bind=engine)

# Base class for models
Base = declarative_base()