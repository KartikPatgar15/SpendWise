import { saveAs } from "file-saver";

export const exportToCSV = (data, filename) => {
  const headers = [
    "Date",
    "Type",
    "Description",
    "Amount"
  ];

  const rows = data.map((e) => [
    e.date,
    e.type,
    e.description,
    e.amount
  ]);

  const csv =
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  const blob = new Blob(
    [csv],
    { type: "text/csv;charset=utf-8;" }
  );

  saveAs(blob, filename);
};