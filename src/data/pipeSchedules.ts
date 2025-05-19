export const pipeScheduleData = {
  Metric: {
    label: "OD in mm",
    columns: [
      { NPS: "1/8", OD: 10.29 },
      { NPS: "1/4", OD: 13.72 },
      { NPS: "3/8", OD: 17.15 },
      { NPS: "21", OD: 21.34 },
      { NPS: "27", OD: 26.67 },
      { NPS: "33", OD: 33.4 },
      { NPS: "42", OD: 42.16 }
      // Add more as needed
    ],
    schedules: {
      "Sch 5S": [1.65, 1.65, 1.65],
      "Sch 10S": [2.11, 2.77, 2.11],
      "Sch 40": [2.77, 3.38, 3.91],
      "Sch 80": [3.73, 4.55, 5.54],
      "Sch 160": [4.75, 6.35, 8.71]
    }
  },
  Imperial: {
    label: "OD in inch (fractional)",
    columns: [
      { NPS: "13/16", OD: 0.84 },
      { NPS: "1 5/16", OD: 1.315 },
      { NPS: "2 3/8", OD: 2.375 }
    ],
    schedules: {
      "Sch 5S": [0.065, 0.065, 0.065],
      "Sch 10S": [0.083, 0.109, 0.083],
      "Sch 40": [0.109, 0.133, 0.154],
      "Sch 80": [0.147, 0.179, 0.218],
      "Sch 160": [0.187, 0.25, 0.343]
    }
  }
};
