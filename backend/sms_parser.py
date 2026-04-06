"""
Simple SMS parser for offline disaster reports.

Supported formats:
1. TYPE|SENDER_CODE|LAT|LNG|BARANGAY|CLIENT_REPORT_ID
2. TYPE|LAT|LNG|USERID|BARANGAY
3. TYPE|USERID|LAT|LNG|BARANGAY

Examples:
- FLOOD|user_42|10.123|123.456|Barangay Uno|report_abc123
- FLOOD|10.123|123.456|42|Barangay Uno
- FLOOD|UserID42|10.123|123.456|Barangay Uno
"""

import re


SENDER_CODE_PATTERN = re.compile(r"^(user|guest)_[a-z0-9][a-z0-9_-]*$")


def parse_user_id(raw_value: str):
    clean_value = raw_value.strip()
    if not clean_value:
        return None

    lowered = clean_value.lower()
    if lowered.startswith("userid"):
        clean_value = clean_value[6:].strip()

    try:
        return int(clean_value)
    except ValueError as error:
        raise ValueError("USERID must be a number, UserID<number>, or blank") from error


def parse_sender_code(raw_value: str):
    clean_value = raw_value.strip().lower()
    if not clean_value:
        raise ValueError("SENDER_CODE is required")

    if not SENDER_CODE_PATTERN.match(clean_value):
        raise ValueError("SENDER_CODE must look like user_12 or guest_device123")

    return clean_value


def parse_sms_message(message: str):
    parts = [part.strip() for part in message.split("|")]

    if len(parts) == 6:
        disaster_type, sender_code_raw, latitude_raw, longitude_raw, barangay, client_report_id = parts

        if not disaster_type or not barangay or not client_report_id.strip():
            raise ValueError("SMS has missing required values")

        try:
            parsed_latitude = float(latitude_raw)
            parsed_longitude = float(longitude_raw)
        except ValueError as error:
            raise ValueError("LAT and LNG must be numbers") from error

        return {
            "disaster_type": disaster_type,
            "latitude": parsed_latitude,
            "longitude": parsed_longitude,
            "user_id": None,
            "sender_code": parse_sender_code(sender_code_raw),
            "barangay": barangay,
            "client_report_id": client_report_id.strip(),
        }

    if len(parts) != 5:
        raise ValueError("SMS format must have 5 or 6 parts separated by |")

    disaster_type = parts[0]
    barangay = parts[4]

    if not disaster_type or not barangay:
        raise ValueError("SMS has missing required values")

    try:
        parsed_latitude = float(parts[1])
        parsed_longitude = float(parts[2])
        parsed_user_id = parse_user_id(parts[3])
    except ValueError:
        parsed_user_id = parse_user_id(parts[1])
        try:
            parsed_latitude = float(parts[2])
            parsed_longitude = float(parts[3])
        except ValueError as error:
            raise ValueError("LAT and LNG must be numbers") from error

    return {
        "disaster_type": disaster_type,
        "latitude": parsed_latitude,
        "longitude": parsed_longitude,
        "user_id": parsed_user_id,
        "sender_code": f"user_{parsed_user_id}" if parsed_user_id is not None else None,
        "barangay": barangay,
        "client_report_id": None,
    }
