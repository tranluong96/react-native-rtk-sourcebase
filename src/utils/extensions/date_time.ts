import moment from "moment";

export const FormatDateToday = (format?: string) => {
  return moment(new Date()).format(format ?? "YYYY-MM-DD");
};

export const FormatYMD = (date: string) => {
  return moment(new Date(date)).format("YYYY/MM/DD");
};

export const FormatYMDHyphens = (date: string) => {
  return moment(new Date(date)).format("YYYY-MM-DD");
};

export const FormatYMDMP = (date: string) => {
  return moment(new Date(date)).format("YYYY/MM/DD");
};

export const FormatTime = (date: string) => {
  return moment(new Date(date)).format("HH:mm");
};

export const FormatYMJA = (date: string) => {
  return moment(new Date(date)).format("YYYY年MM");
};

export const FormatYMLabelJA = (date: string) => {
  return moment(new Date(date)).format("YYYY年MM月");
};

export const FormatYMDJA = (date: string) => {
  return moment(new Date(date)).format("YYYY年M月DD日");
};

export const FormatYMDHMJA = (date: string) => {
  return moment(new Date(date)).format("YYYY年M月DD日 HH:mm分");
};

export const FormatDayShortJA = (date: string) => {
  return moment(new Date(date)).format("E");
};

export const dateTimeCurrent = moment(new Date());

export const FormatMD = (date: string) => {
  return moment(new Date(date)).format("MM/DD");
};

export const FormatFullDate = (date: string) => {
  return moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss");
};

export const dateStartMonth = (date: moment.Moment) =>
  moment(new Date(date.year(), date.month(), 1)).format("YYYY-MM-DD");

export const dateEndMonth = (date: moment.Moment) => date.endOf("month").format("YYYY-MM-DD");

export const isToday = (date: string) =>
  FormatYMD(date) === FormatYMD(moment(new Date()).toString());

export const isBeforeDate = (date: string) =>
  moment(date).isBefore(new Date(moment().year(), moment().month(), moment().date()));

export const isAfterDate = (date: string) =>
  moment(date).isAfter(new Date(moment().year(), moment().month(), moment().date()));

export const isSameDate = (current, after) => {
  const momentCurrent = moment(current);
  const momentAfter = moment(after);

  return (
    momentCurrent.year() === momentAfter.year() &&
    momentCurrent.month() === momentAfter.month() &&
    momentCurrent.date() === momentAfter.date()
  );
};

export const isBeforeOneDate = (date: string) => {
  const dateConfirm = moment().add(1, "days");
  return moment(date).isBefore(
    new Date(dateConfirm.year(), dateConfirm.month(), dateConfirm.date())
  );
};

export const timeZone = moment().format('Z');