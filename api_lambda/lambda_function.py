import json
import traceback
import datetime
import os
from fastapi import FastAPI, APIRouter, Depends, Request, HTTPException, Header, status, Body, Path
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.security.api_key import APIKeyHeader
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import ExceptionMiddleware
from mangum import Mangum
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import jwt
from enum import Enum

from log_util import logger
from router import LoggerRouteHandler


_USER_ID = None

PRODUCTION = os.environ.get("PRODUCTION") or "false"
CLOUDKOMMAND_URL = "https://validatecloudformation.com" if PRODUCTION == "true" else "http://ck-dg1-g-cloudkommand-core-ui.s3-website-us-east-1.amazonaws.com" if PRODUCTION == "dg1" else "http://localhost:3000"
API_PREFIX = os.environ.get("API_PREFIX") or ""
VERSION = os.environ.get("VERSION") or "1.0.0"
API_GATEWAY_STAGE = os.environ.get("API_GATEWAY_STAGE") or ""
# PATH_VERSION_PREFIX = "/api/v1"
FULL_PATH_PREFIX = f"{'/' if API_GATEWAY_STAGE else ''}{API_GATEWAY_STAGE}{API_PREFIX}"


app = FastAPI(
        title="Validate CloudFormation API Documentation",
        summary="Public-facing Validate CloudFormation API documentation to be used for integrations.",
        description="Learn about the various Validate CloudFormation API calls and try them out!",
        version=VERSION,
        docs_url=f"/docs",
        root_path=f"{FULL_PATH_PREFIX}" if PRODUCTION == "false" else f"{API_PREFIX}", # If it is production, you'll have a custom url, so you remove the api gateway stage from the app itself
        middleware=[
            Middleware(
                CORSMiddleware, 
                allow_origins=["*"],
                allow_credentials=True,
                allow_methods=["*"], 
                allow_headers=["*"]
            )
        ],
        terms_of_service="https://validatecloudformation.com/terms",
        contact={
            "name": "David Gal-Chis",
            "email": "david@validatecloudformation.com",
        },
        # dependencies=[Depends(body_json)]
    )
app.router.route_class = LoggerRouteHandler
app.add_middleware(ExceptionMiddleware, handlers=app.exception_handlers)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request, err):
    logger.exception("Unhandled exception")
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

class ValidateCloudformationRequest(BaseModel):
    content: Optional[str] = None

@app.post(
    "/validate-cloudformation", 
    status_code=200, 
    tags=["VALIDATE"],
    name="validate_cloudformation"
    )
# @log
def api_validate_cloudformation(
        body: ValidateCloudformationRequest
    ):
    print(body)
    print(body.content)
    ###
    # TODO: Do something
    ###
    result = {
        "status": "valid"
    }
    return result

@app.get(
    f"/", 
    status_code=200, 
    tags=["PING"],
    name="ping"
    )
async def root(request:Request):
  return {"message": "Hello CloudFormation Validator!"}

lambda_handler = Mangum(app,
    api_gateway_base_path=FULL_PATH_PREFIX)
lambda_handler = logger.inject_lambda_context(lambda_handler, clear_state=True)

