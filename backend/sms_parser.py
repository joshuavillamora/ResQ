"""
    Formats an SMS text message into a structured report dictionary.

    Expected SMS format: "TYPE|LAT|LNG|USERID|BARANGAY"
    Example: "flood|10.123|123.456|42|Barangay Uno"
"""
def parse_sms_message(message: str):

    # Split the SMS by "|" and remove extra whitespace from each part
    parts = [part.strip() for part in message.split("|")]

    if len(parts) != 5:
        raise ValueError("SMS format must be TYPE|LAT|LNG|USERID|BARANGAY")

    disaster_type, latitude, longitude, user_id, barangay = parts

    # Check for missing required fields (disaster_type, latitude, longitude, barangay)
    if not disaster_type or not latitude or not longitude or not barangay:
        raise ValueError("SMS has missing required values")

    parsed_user_id = None
    if user_id:
        try:
            parsed_user_id = int(user_id)
        except ValueError as error:
            raise ValueError("USERID must be a number or blank") from error

    try:
        parsed_latitude = float(latitude)
        parsed_longitude = float(longitude)
    except ValueError as error:
        raise ValueError("LAT and LNG must be numbers") from error

    # Return the parsed SMS as a dictionary
    return {
        "disaster_type": disaster_type,
        "latitude": parsed_latitude,
        "longitude": parsed_longitude,
        "user_id": parsed_user_id,
        "barangay": barangay,
    }
