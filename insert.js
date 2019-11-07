var connection = createConnection({
  host: 'remotemysql.com',
  user: 'DNidXqyh7U',
  password: 'x2eR4raZGa',
  database: 'DNidXqyh7U'
});
connection.connect();

var group = {
    group_code: 'Git tutorial',
    group_name: 'foo bar',
    exchange_gift_date: '2019-12-26',
    signup_deadline: '2019-12-22',
    spending_minimum: 500,
    admin_name: 'foo bar',
    admin_email: 'test@yahoo.com',
    admin_password: '123456',
};

var query = connection.query('insert into main_group set ?', group, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
  console.error(result);
});