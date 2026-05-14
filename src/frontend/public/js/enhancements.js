Set.prototype.toArray = function () {
  return Array.from(this);
};

Array.prototype.pushUnique = function (value) {
  if (!(this.indexOf(value) === -1)) return this;
  this.push(value);
  return this;
};
Array.prototype.unique = function () {
  let set1 = new Set(this);
  return set1.toArray();
};
Array.prototype.last = function () {
  return this[this.length - 1];
};
Array.prototype.removeByValue = function (val) {
  let i = this.indexOf(val);
  if (i == -1) return this;
  this.splice(i, 1);
  return this;
};
Array.prototype.getUnique = function () {
  return this.filter((item, index) => this.indexOf(item) === index);
};
Array.prototype.removeBlank = function () {
  let i = this.indexOf("");
  while (i != -1) {
    this.splice(i, 1);
    i = this.indexOf("");
  }
  return this;
};
Array.prototype.diff = function (arr) {
  if (!Array.isArray(arr)) return { old: [], added: [], removed: [] };
  let old = this.filter((item) => arr.includes(item));
  let added = arr.filter((item) => !this.includes(item));
  let removed = this.filter((item) => !arr.includes(item));
  return { old, added, removed };
};
Array.prototype.min = function () {
  if (this.length === 0) return undefined;
  let min = this[0];
  for (let i = 1; i < this.length; i++) {
    if (this[i] < min) {
      min = this[i];
    }
  }
  return min;
};

Date.prototype.timestamp = function () {
  return Math.floor(this.getTime() / 1000);
};
Date.prototype.next = function (offsetStr = "0d") {
  const match = offsetStr.match(/^(\d+)([dwmy])$/i);
  if (!match) {
    throw new Error(
      "Invalid format. Use format like '5d', '2w', '3m', or '1y'."
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  const newDate = new Date(this.getTime()); // clone current date

  switch (unit) {
    case "d":
      newDate.setDate(newDate.getDate() + value);
      break;
    case "w":
      newDate.setDate(newDate.getDate() + value * 7);
      break;
    case "m":
      newDate.setMonth(newDate.getMonth() + value);
      break;
    case "y":
      newDate.setFullYear(newDate.getFullYear() + value);
      break;
    default:
      throw new Error("Unsupported time unit.");
  }

  return newDate;
};
Date.prototype.showDate = function (
  format = "dd-mmm-yyyy",
  locale = "default"
) {
  const options = {
    day: "2-digit",
    month: format.includes("mmmm")
      ? "long"
      : format.includes("mmm")
        ? "short"
        : "2-digit",
    year: format.includes("yyyy") ? "numeric" : "2-digit",
  };

  try {
    const parts = new Intl.DateTimeFormat(locale, options).formatToParts(this);
    const map = {};
    parts.forEach((p) => {
      if (p.type !== "literal") map[p.type] = p.value;
    });

    const day = map.day;
    const year = map.year;
    const month = map.month;

    return format
      .replace(/dd/, day)
      .replace(/mmmm/, month) // full month
      .replace(/mmm/, month) // short month
      .replace(
        /mm/,
        this.getMonth() + 1 < 10
          ? "0" + (this.getMonth() + 1)
          : this.getMonth() + 1
      )
      .replace(/yyyy/, year)
      .replace(/yy/, year.slice(-2));
  } catch (error) {
    return "";
  }
};
Date.prototype.showMonthAndYear = function (
  format = "mmm-yyyy",
  locale = "default"
) {
  const options = {
    day: "2-digit",
    month: format.includes("mmmm")
      ? "long"
      : format.includes("mmm")
        ? "short"
        : "2-digit",
    year: format.includes("yyyy") ? "numeric" : "2-digit",
  };

  try {
    const parts = new Intl.DateTimeFormat(locale, options).formatToParts(this);
    const map = {};
    parts.forEach((p) => {
      if (p.type !== "literal") map[p.type] = p.value;
    });

    const day = map.day;
    const year = map.year;
    const month = map.month;

    return format
      .replace(/dd/, day)
      .replace(/mmmm/, month) // full month
      .replace(/mmm/, month) // short month
      .replace(
        /mm/,
        this.getMonth() + 1 < 10
          ? "0" + (this.getMonth() + 1)
          : this.getMonth() + 1
      )
      .replace(/yyyy/, year)
      .replace(/yy/, year.slice(-2));
  } catch (error) {
    return "";
  }
};
Date.prototype.toDate = function () {
  return this;
};
Date.prototype.relativeTime = function () {
  const slabs = [0, 60, 3600, 86400, 604800, 2592000, 31536000];
  const slabNames = [
    "just now",
    ["second", "seconds"],
    ["minute", "minutes"],
    ["hour", "hours"],
    ["day", "days"],
    ["week", "weeks"],
    ["month", "months"],
    ["year", "years"],
  ];
  const now = new Date();
  const diffMs = now - this;
  const diffSeconds = Math.round(Math.abs(diffMs) / 1000);
  const myslab = slabs.indexOf(slabs.find((slab) => slab > diffSeconds));
  const range =
    myslab > -1 ? [slabs[myslab - 1], slabs[myslab]] : [slabs.at(-1)];
  const value =
    range[0] === 0 ? diffSeconds : Math.floor(diffSeconds / range[0]);
  const units = slabNames.at(myslab);
  return `${value} ${value === 1 ? units[0] : units[1]}`;
};
Date.prototype.toFormat = function (
  format = "dd-mm-yyyy - hh:mm:ss",
  locale = "en-IN"
) {
  const fmt = format.toLowerCase();
  const options = {
    day: "2-digit",
    month: fmt.includes("mmmm")
      ? "long"
      : fmt.includes("mmm")
        ? "short"
        : "2-digit",
    year: fmt.includes("yyyy") ? "numeric" : "2-digit",
    hour: fmt.includes("hh") ? "2-digit" : undefined,
    minute: fmt.includes("mm") ? "2-digit" : undefined,
    second: fmt.includes("ss") ? "2-digit" : undefined,
  };
  return new Intl.DateTimeFormat(locale, options).format(this);
};
Date.prototype.showTime = function (
  format = "dd-mm-yyyy - hh:mm:ss",
  locale = "en-IN",
  absolute = false
) {
  const fmt = format.toLowerCase();
  const options = {
    hour: fmt.includes("hh") ? "2-digit" : undefined,
    minute: fmt.includes("mm") ? "2-digit" : undefined,
    second: fmt.includes("ss") ? "2-digit" : undefined,
    hour12: !absolute
  };
  return new Intl.DateTimeFormat(locale, options).format(this);
};
Date.prototype.isoWeek = function () {
  let yearStart = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((this - yearStart) / (1000 * 60 * 60 * 24 * 7));
};

String.prototype.Capitalize = function () {
  let char1 = this.charAt(0).toUpperCase();
  let string = this;
  return string.replace(string[0], char1);
};
String.prototype.sluggify = function () {
  return this.trim() // Remove leading/trailing whitespace
    .toLowerCase() // Convert to lowercase for consistency
    .replace(/[^a-z0-9\s]/g, "-") // Replace special characters with dash
    .replace(/\s+/g, "-") // Replace whitespace sequences with dash
    .replace(/-+/g, "-") // Collapse multiple consecutive dashes
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
};
Number.prototype.toMoney = function (currency = "INR", locale = "en-IN") {
  const format = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format;
  return format(this);
};
Number.prototype.toPercent = function (locale = "en-IN") {
  const { format } = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    minimumIntegerDigits: 2,
  });
  return format(this / 100);
};
Number.prototype.toTime = Number.prototype.toTimeElapsed = function () {
  let temp = this;
  let ms = temp % 1000; temp = (temp - ms) / 1000;
  let sec = temp % 60; temp = (temp - sec) / 60;
  let min = temp % 60; temp = (temp - min) / 60;
  let hr = temp;
  return `${hr}:${(min < 10) ? `0${min}` : min}:${(sec < 10) ? `0${sec}` : sec}.${ms}`
}
Array.prototype.avg = function () {
  let sum = 0;
  for (let i = 0; i < this.length; i++) {
    sum += Number(this[i]);
  }
  return (sum / this.length)
}
