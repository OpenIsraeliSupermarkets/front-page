#!/bin/bash

# Set this to your project reference if needed
# PROJECT_REF="your-project-ref"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of all Supabase functions...${NC}"

# Directory containing all functions
FUNCTIONS_DIR="./supabase/functions"

# Check if functions directory exists
if [ ! -d "$FUNCTIONS_DIR" ]; then
    echo -e "${RED}Error: Functions directory not found at $FUNCTIONS_DIR${NC}"
    exit 1
fi

# Count of functions
TOTAL_FUNCTIONS=$(find "$FUNCTIONS_DIR" -maxdepth 1 -type d | grep -v "^$FUNCTIONS_DIR$" | wc -l)
DEPLOYED=0
FAILED=0

echo -e "${YELLOW}Found $TOTAL_FUNCTIONS functions to deploy${NC}"

# Loop through each function directory
for FUNCTION_DIR in "$FUNCTIONS_DIR"/*; do
    if [ -d "$FUNCTION_DIR" ]; then
        FUNCTION_NAME=$(basename "$FUNCTION_DIR")
        
        # Skip hidden directories
        if [[ $FUNCTION_NAME == .* ]]; then
            continue
        fi
        
        echo -e "${YELLOW}Deploying function: $FUNCTION_NAME${NC}"
        
        # Deploy the function
        if [ -n "$PROJECT_REF" ]; then
            supabase functions deploy "$FUNCTION_NAME" --project-ref "$PROJECT_REF"
        else
            supabase functions deploy "$FUNCTION_NAME"
        fi
        
        # Check if deployment was successful
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Successfully deployed $FUNCTION_NAME${NC}"
            DEPLOYED=$((DEPLOYED + 1))
        else
            echo -e "${RED}Failed to deploy $FUNCTION_NAME${NC}"
            FAILED=$((FAILED + 1))
        fi
        
        echo ""
    fi
done

echo -e "${YELLOW}Deployment complete${NC}"
echo -e "${GREEN}Successfully deployed: $DEPLOYED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed to deploy: $FAILED${NC}"
fi

# Verify all functions are listed
echo -e "${YELLOW}Listing all deployed functions:${NC}"
if [ -n "$PROJECT_REF" ]; then
    supabase functions list --project-ref "$PROJECT_REF"
else
    supabase functions list
fi 