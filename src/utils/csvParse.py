import json

def transform_pipe_data(data):
    transformed = {}

    for unit_system, unit_data in data.items():
        columns = unit_data.get("columns", [])
        schedules = unit_data.get("schedules", {})


        nps_dict = {}

        for i, entry in enumerate(columns):
            nps = str(entry.get("NPS"))
            od = entry.get("OD")


            schedule_thicknesses = {}
            for schedule_name, thicknesses in schedules.items():
                if i < len(thicknesses):
                    thickness = thicknesses[i]
                    if thickness is not None:
                        schedule_thicknesses[schedule_name] = thickness

            nps_dict[nps] = {
                "OD": od,
                "schedules": schedule_thicknesses
            }

        transformed[unit_system] = nps_dict

    return transformed

if __name__ == "__main__":
    file_path = "pipeData.json"

    with open(file_path, "r") as f:
        data = json.load(f)

    transformed_data = transform_pipe_data(data)

    with open("transformed_pipeData.json", "w") as f:
        json.dump(transformed_data, f, indent=2)

    print("Transformation complete, saved to transformed_pipeData.json")
