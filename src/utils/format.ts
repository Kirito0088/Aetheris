export const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 0,
});

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatNumberWithOptions = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("en-US", options).format(value);
};
