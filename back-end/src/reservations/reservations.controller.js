const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const {today} = require("../utils/date-time")

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  // lists all reservations for a day (from query)
  
  const day = req.query.date;
  console.log(day)
  const data = await service.list();
  
  // const sorted = data.sort((a, b) => Number(a.reservation_time) - Number(b.reservation_time))

  // console.log(sorted);
   const dataForDate = data.filter((data) => data.reservations_date === day)
   console.log(dataForDate);
  res.json({data: dataForDate});
}

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => {
      if (field === reservation_date) console.log(field);
      !VALID_PROPERTIES.includes(field)
    }
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const hasReqProps = hasProperties(
"first_name",
"last_name",
"mobile_number",
"reservation_date",
"reservation_time",
"people");

async function create(req, res, next) {
  const newReservation = {
    ...req.body.data
  }
  const data = await service.create(newReservation);
  res.status(201).json({ data: data })
};

module.exports = {
  list,
  create: [ asyncErrorBoundary(hasReqProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ],
};
