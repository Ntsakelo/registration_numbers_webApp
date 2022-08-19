document.addEventListener("DOMContentLoaded", function () {
  const errorMsg = document.querySelector(".stateMsg");
  const errorTxt = document.querySelector(".state");
  if (errorTxt.innerHTML === "") {
    errorMsg.setAttribute("style", "opacity:0");
  } else if (errorTxt.innerHTML !== "") {
    errorMsg.setAttribute("style", "opacity:1");
  }

  setTimeout(function () {
    errorMsg.setAttribute("style", "opacity:0");
  }, 3000);
  const closeInstructions = document.querySelector(".closeInstructions");
  const infoLink = document.querySelector(".instrBtn");
  const instructions = document.querySelector(".instructions");
  const usageInfo = document.querySelector(".usageInfo");
  closeInstructions.addEventListener("click", function () {
    instructions.classList.remove("addInfo");
    instructions.classList.add("removeInfo");

    usageInfo.classList.remove("infoIn");
    usageInfo.classList.add("infoOut");
  });

  infoLink.addEventListener("click", function () {
    instructions.classList.remove("removeInfo");
    instructions.classList.add("addInfo");

    usageInfo.classList.remove("infoOut");
    usageInfo.classList.add("infoIn");
  });
});
