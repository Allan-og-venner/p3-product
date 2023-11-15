'use server'
const jwt = require("jsonwebtoken");
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {

    try {
        const headersInstance = headers();
        const authHeader = headersInstance.get("authorization");

        if (!authHeader) {
          return NextResponse.json(
            { message: "Authorization header missing" },
            {
              status: 401, // 401 indicates unauthorized
            }
          );
        }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return NextResponse.json(
        { message: "Expired" },
        {
          status: 400,
        }
      );
    } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        { message: "Expired" },
        {
          status: 400,
        }
      );
    } else {
      // If the token is valid, return some protected data.
      return NextResponse.json(
        { data: "Protected data" },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Token verification failed", error);
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 400,
      }
    );
  }
}