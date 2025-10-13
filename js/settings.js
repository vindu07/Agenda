import{currentPage, lastPage } from "./app.js";
import * as utils from "./utils.js";

export function initSettings(){

    document.addEventListener("DOMContentLoaded", () => {
      const closeBtn = document.getElementById("close-settings");
      closeBtn.addEventListener("click", async () => {
        await utils.loadPage(lastPage);
      });
    });
  
}
