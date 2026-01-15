$(function () {
  function renderPatientHeader(p) {
    console.log(p);
    $("#pAvatar").attr("src", p.avatar);
    $("#pName").text(p.name);
    $("#pBasic").text(`${p.age}Y • ${p.gender} • ${p.city}`);
    $("#pAmount").text(`₹${p.amountDue}`);
    $("#pVisits").text(p.visits);
    $("#pLastVisit").text(p.lastVisit);
    $("#pPhone").html(
      `<i class="fa fa-mobile mr-2 text-custom"></i> ${p.phone}`
    );
  }
  renderPatientHeader(mockPatient);
});
