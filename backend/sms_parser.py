"""
Simple SMS parser for offline disaster reports.

Supported formats:
1. TYPE|LAT|LNG|USERID|BARANGAY
2. TYPE|USERID|LAT|LNG|BARANGAY

Examples:
- FLOOD|10.123|123.456|42|Barangay Uno
- FLOOD|UserID42|10.123|123.456|Barangay Uno
"""


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


def parse_sms_message(message: str):
    parts = [part.strip() for part in message.split("|")]

    if len(parts) != 5:
        raise ValueError("SMS format must have 5 parts separated by |")

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
        "barangay": barangay,
    }
