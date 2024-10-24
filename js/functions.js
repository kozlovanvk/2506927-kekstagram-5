const canHaveMeeting = function (startWorkday, endWorkday, startMeeting, meetingLength) {
  //Можно в перевести все в минуты, но я перевела в часы (например, '15:30' => 15,5)
  startWorkday = startWorkday.split(':');
  startWorkday = Number(startWorkday[0]) + Number(startWorkday[1] / 60);

  endWorkday = endWorkday.split(':');
  endWorkday = Number(endWorkday[0]) + Number(endWorkday[1] / 60);

  startMeeting = startMeeting.split(':');

  let endMeeting = [Number(startMeeting[0]) + parseInt(meetingLength / 60, 10), meetingLength - parseInt(meetingLength / 60, 10) * 60];
  endMeeting = endMeeting[0] + endMeeting[1] / 60;

  startMeeting = Number(startMeeting[0]) + Number(startMeeting[1] / 60);

  if (startWorkday <= startMeeting & startMeeting < endWorkday & endMeeting <= endWorkday) {
    return true;
  } else {
    return false;
  }
};
canHaveMeeting();
