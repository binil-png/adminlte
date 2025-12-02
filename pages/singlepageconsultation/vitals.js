$(function () {
  // Allergy add/remove
  $("#addAllergy").on("click", function (e) {
    e.preventDefault();
    $("#allergyList").append(
      '<div class="input-group mb-2 allergy-row">< + """>'
    );
  });

  // Better implementation: use template
  function addAllergyRow(value) {
    var row = $('<div class="input-group mb-2 allergy-row col-md-2 col-lg-2">')
      .append(
        $(
          '<input type="text" class="form-control rounded-start-4 input-style">'
        ).val(value || "")
      )
      .append(
        $('<div class="input-group-append">').append(
          $(
            '<button style="padding: 0px 8px" class="btn btn-outline-danger btn-remove-allergy rounded-end-4" type="button"><i class="fas fa-times"></i></button>'
          )
        )
      );
    $("#allergyList").append(row);
  }

  // initialize existing
  $("#allergyList .allergy-row input").each(function () {
    /* already exist*/
  });

  $("#addAllergy")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      addAllergyRow("");
    });

  $(document).on("click", ".btn-remove-allergy", function () {
    $(this).closest(".allergy-row").remove();
  });

  $("#saveVitals").click(function () {
    const vitals = getVitalsFormData();
    console.log("Vitals Saved:", vitals);
  });

  function getVitalsFormData() {
    const form = $("#vitalsForm");

    return {
      temperature: form.find("input[name='temp']").val(),
      height: form.find("input[name='height']").val(),
      weight: form.find("input[name='weight']").val(),

      bp: {
        systolic: form.find("input[name='bp']").eq(0).val(),
        diastolic: form.find("input[name='bp']").eq(1).val(),
        position: form.find("select").val(),
      },

      glucose: form.find("input[placeholder='Enter blood glucose']").val(),
      pulse: form.find("input[placeholder='Enter pulse']").val(),
      cholesterol: form.find("input[placeholder='Enter cholesterol']").val(),
      spo2: form.find("input[placeholder='Enter SPO2']").val(),
      respiratoryRate: form
        .find("input[placeholder='Enter respiratory rate']")
        .val(),

      allergies: getAllergies(),
    };
  }

  function getAllergies() {
    const allergies = [];

    $("#allergyList .allergy-row input").each(function () {
      const value = $(this).val().trim();
      if (value !== "") allergies.push(value);
    });

    return allergies;
  }

  $("#addAllergy").click(function (e) {
    e.preventDefault();
    $("#allergyList").append(`
    <div class="input-group mb-2 allergy-row col-md-2 col-lg-2">
      <input type="text" class="form-control rounded-start-4 input-style" />
      <div class="input-group-append">
        <button style="padding: 0px 8px" 
                class="btn btn-outline-danger btn-remove-allergy rounded-end-4" 
                type="button">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `);
  });

  function setVitalsFormData(data) {
    const form = $("#vitalsForm");

    form.find("input[name='temp']").val(data.temperature);
    form.find("input[name='height']").val(data.height);
    form.find("input[name='weight']").val(data.weight);

    form.find("input[name='bp']").eq(0).val(data.bp.systolic);
    form.find("input[name='bp']").eq(1).val(data.bp.diastolic);
    form.find("select").val(data.bp.position);

    form.find("input[placeholder='Enter blood glucose']").val(data.glucose);
    form.find("input[placeholder='Enter pulse']").val(data.pulse);
    form.find("input[placeholder='Enter cholesterol']").val(data.cholesterol);
    form.find("input[placeholder='Enter SPO2']").val(data.spo2);
    form
      .find("input[placeholder='Enter respiratory rate']")
      .val(data.respiratoryRate);

    setAllergies(data.allergies);
  }

  function setAllergies(allergies) {
    $("#allergyList").empty();

    allergies.forEach((item) => {
      $("#allergyList").append(`
      <div class="input-group mb-2 allergy-row col-md-2 col-lg-2">
        <input type="text" class="form-control rounded-start-4 input-style" value="${item}" />
        <div class="input-group-append">
          <button style="padding: 0px 8px"
                  class="btn btn-outline-danger btn-remove-allergy rounded-end-4" 
                  type="button">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `);
    });
  }

  $(document).ready(function () {
    setVitalsFormData(mockVitals);
  });
});
