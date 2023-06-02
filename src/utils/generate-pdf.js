import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = (newsFeed) => {
  // initialize jsPDF
  const doc = new jsPDF();
  const tableColumn = ["Agency", "News", "Click Count"];
  const tableRows = [];
  newsFeed.forEach((news) => {
    let title = news.title;
    if (news.title.length > 60) {
      title = news.title.substring(0, 60).concat("...");
    }
    const newsData = [news?.agencyId?.name, title, news?.clickCount];
    tableRows.push(newsData);
  });

  // startY is margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  // ticket title. and margin-top + margin-left
  doc.text("Report", 14, 15);
  doc.save(`report.pdf`);
};

export default generatePDF;
