const puppeteer = require("puppeteer");
const fs = require("fs");

const crawlTourContent = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.ivivu.com/du-lich/tour-phu-quoc");

  const links = await page.evaluate(getLinks);

  let tourList = [];
  for (const link of links) {
    try {
      await page.goto(link);
      const tours = await page.evaluate(getTourFromLink);
      tourList = [...tourList, ...tours];
    } catch (e) {
      console.log(e);
    }
  }
  const dir = './img';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  for (const { imgLocal, img } of tourList) {

    const viewSrc = await page.goto(img);
    writeFile(imgLocal, await viewSrc.buffer());
  }

  writeFile("storage.txt", JSON.stringify(tourList));

  await browser.close();
};

const writeFile = (fileName, content, flag = "w") => {
  fs.writeFile(fileName, content, { flag: flag }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully write file");
    }
  });
};

const getLinks = () => {
  const linkContainer = document.getElementsByClassName("tourListSideBar")[0];
  const linkLocation = linkContainer.getElementsByTagName("a");
  const linkArr = Array.from(linkLocation);
  return linkArr.map((item) => item.href);
};

const getTourFromLink = () => {
  const convertDate = (from, duration) => {
    const fromArr = from.split(/\/|\-/g);

    const fromDate = new Date(fromArr[2], fromArr[1] * 1 + 2, fromArr[0]).getTime();

    let addDuration;
    if (duration === "Trong Ngày") {
      addDuration = 1;
    } else {
      const durationArr = duration.split(/Ngày|Đêm|[ ]/g).filter((i) => i);
      addDuration =
        durationArr[0] >= durationArr[1] ? durationArr[0] : durationArr[1];
    }

    console.log("Inside func: ", fromDate, addDuration);
    const toDate = fromDate + addDuration * 60 * 60 * 24 * 1000;

    return {
      fromDate: fromDate,
      toDate: toDate,
    };
  };
  const cardArr = Array.from(document.getElementsByClassName("tourItem"));
  return cardArr.map((item) => {
    const imgSrc = item
      .getElementsByClassName("img-responsive")[0]
      .getAttribute("data-src");
    const img = `https:${imgSrc}`;
    const imgLink = "img/" + img.replace(/[a-z0-9\:\.]*\//g, "");

    const title = item
      .getElementsByClassName("tourItemName")[0]
      .getElementsByClassName("linkDetail")[0]
      .innerHTML.trim();
    const isFull = !item.getElementsByClassName("tourItemFull")[0] !== true;

    const tourPrice = isFull
      ? "2500000"
      : item
        .getElementsByClassName("tourItemPrice")[0]
        .innerHTML.replace(/[.]/g, "")
        .replace(/<span [\w\W\=\"\-]*>[\w\W ]*<\/span>/, "")
        .trim();

    const departure = isFull
      ? "15/7/2020"
      : item
        .getElementsByClassName("tourItemDateTime")[0]
        .innerHTML.trim()
        .replace("Khởi hành: ", "");
    const duration = isFull
      ? "3 Ngày 4 Đêm"
      : item
        .getElementsByClassName("glyphicon-time")[0]
        .parentNode.innerHTML.replace(/<i[a-z A-Z="-]*><\/i>/, "")
        .trim();

    const { fromDate, toDate } = convertDate(departure, duration);

    const toLocation = title
      .split(":")[0]
      .replace(/Tour|[0-9]N([0-9][DĐ]){0,1}/g, "")
      .trim();

    //Generate random quota for tour
    const quota = Math.floor(Math.random() * (53 - 17 + 1) + 17);
    return {
      img: img,
      title: title,
      price: tourPrice,
      from: fromDate,
      to: toDate,
      imgLocal: imgLink,
      toLocation: toLocation,
      quota: quota,
    };
  });
};

crawlTourContent();
