using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace DownThemAllLinkCreator.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetHTMLString(string url)
        {
            string downloadedString = "";// System.IO.File.ReadAllText(@"C:\db\sample.html");
            using (var client = new WebClient())
            {
                downloadedString = client.DownloadString(url);
            }

            return Json(downloadedString);
        }
    }
}
