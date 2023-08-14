
var appLanguage = 'Heb';

import {Injectable} from '@angular/core';  

@Injectable()
export class Lang {
 
  public User;
  public General;
  public Validation;
  public HomePage;
  public Container;
  public Authority;
  public Project;
  public ProjectContainer;
  public ContainerUnloading;
  public ImeiUnloadingData;
  public Alert;
  public ContainerState;
  public currentLang;
  public Client;
  public Order;
  public Directions;
  public SupplierOrder;

  setAppLang(lang ) {
    appLanguage=lang;
    this.currentLang=lang;
    
    if(appLanguage=='Eng')
      this.loadEng();
    
  }

   getAppLang() {
     return appLanguage;   
  }
  
  constructor( ) {

    this.currentLang='Heb';
    this.General = {};
    this.General.select = "בחר רשומה";//-- v22
    this.General.save = "שמור";
    this.General.back = "סגור";
    this.General.update = "עדכן";
    this.General.view = "הצג";
    this.General.map = "מפה";
    this.General.goBack = "חזרה";
    this.General.edit = "עריכה";
    this.General.goto = "טעון נתונים";
    this.General.clean = "נקה";
    this.General.cleanAndNew = "נקה/חדש";
    this.General.duplicate = "שכפל";
    this.General.search = "חפש";
    this.General.new = "חדש";
    this.General.delete = "מחק";
    this.General.cancel = "ביטול";
    this.General.backAndCancel = "ביטול וחזרה";
    this.General.searchModuleTitle = "מודול חיפוש";
    this.General.name = "שם";
    this.General.select = "בחר";
    this.General.name = "שם";
    this.General.typeToSearch = "הקלד פה לחפש"; 
    this.General.yes = "כן";
    this.General.no = "לא";
    this.General.manager = "מנהל";
    this.General.fromDate = "מתאריך";
    this.General.toDate = "עד תאריך";    
    this.General.refresh =" "; //"רענן";
    this.General.confirmDelete = "האם ברצונך למחוק את הפריט שבחרת";
    this.General.confirmCancel = "האם ברצונך לבטל את הפעולה הנוכחית";
    this.General.text2search = " מלל חופשי";    
    this.General.next = " המשך";
    this.General.submit = " סיים";
    this.General.saveComplete = " הפעולה נקלטה";
    this.General.noGPSdata = "לא ניתן לצפות במפה , לא נקלטו מיקומים";
    this.General.mapHistory = " ";//"דיווחים ישנים";
    this.General.select2Date = "טווח תאריכים";
    this.General.exitContainer = "פנה מכולה";
    this.General.exitContainerFromProject = "פנה מכולה מפרויקט";
    this.General.onDate = "תאריך";
    this.General.mapAllContainers = "הכל";
    this.General.ShowfilterOptions = " ";//"סנון";
    this.General.to = " עד ";        
    this.General.filter = " סנן ";  
    this.General.cancelfilter = " בטל ";  
    this.General.waseIt = "נווט ליעד";  
    this.General.showActions = "פעולות";  
    this.General.actions = "פעולות"; 
    this.General.actionCompleted = "הפעולה נקלטה במערכת"; 
    this.General.cancelSearch = " בטל ";
    this.General.hours = "שעות";
    this.General.minutes = "דקות";
    this.General.cancelSelected = "בטל בחירה";
    this.General.NoPermision ="אין לך הרשאה לבצע פעולה זו";
    this.General.sign ="חתימה";
    this.General.findInArround ="הצג מכולות באיזור שלי";
    this.General.filterWeightNotFilled = " ללא משקל ";
    this.General.filterUnloaded = " ללא פריקה ";
    this.General.currentMap = "מפה עדכנית";
    this.General.historicalMap = "מסלול / היסטוריה"; 
    this.General.Insert2Project = "הצב בפרויקט"; 
    this.General.Insert2ProjectMainList = "הצבה"; 
    this.General.ShowAlsoNotActive = "הצג גם לא פעילים"; 
    this.General.findLocation = "מצא מיקום"; 
    this.General.typeLocation = "הזן מיקום";   
    this.General.green = "ירוק";
    this.General.yellow = "צהוב";
    this.General.red = "אדום";
    this.General.blue = "כחול";
    this.General.black = "שחור";
    this.General.aqua = "כחול בהיר";
    this.General.white = "לבן"; 
    this.General.orange = "כתום";
    this.General.crimson = "ארגמן";
    this.General.brown = "חום";
    this.General.grey = "אפור";
    this.General.pink = "ורוד";
    this.General.purple = "סגול";
    this.General.khaki = "חאקי";
    this.General.teal = "";
    this.General.turquoise = "טורקיז";
    this.General.indigo = "כחול כהה";
    this.General.cyan = "ציאן";
    this.General.Maroon = "בורדו";
    this.General.Magenta = "מג'נטה";
    this.General.Silver = "כסף";
    this.General.SelectingTown = "בחירת ישוב";
    this.General.NotInsideAuthorityAreaMsg = "המכולה אינה בתחום הראשות";
    this.General.Loading = "טוען";
    this.General.NoData = "אין נתונים להצגה";
    this.General.M3 = "(מ''ק)";

    this.Directions={};
    this.Directions = {North: "צפון", northeast: " צפון מזרח ", East: "מזרח", southeast: " דרום מזרח", South: "דרום", southwest: "דרום מערב", West: "מערב", northwest: "צפון מערב " };


    this.Validation = {};
    this.Validation.Mandatory = "יש להזין כל שדות החובה";
    this.Validation.InCorrectEmail = "מיל לא תקין";
    this.Validation.SelectSite = "בחירת אתר פסולת";
    this.Validation.SelectSiteAndAmount = "יש לבחור אתר וכמות ואז המשך";
    this.Validation.NonCorrect = "לא תקין";
    this.Validation.submitFailObjectExist = "לא ניתן לשמור הנתונים שהזנת כבר קיימים במערכת";
    this.Validation.submitFail = "לא ניתן לשמור אירעה תקלה";
    this.Validation.containerNotBelong2u = "מכולה איני שייכת למשתמש זה";
    this.Validation.containerNotExist ="לא ניתן לשמור, המכולה לא מוגדרת במערכת";
    this.Validation.containerExsitOnThisSite ="לא ניתן לשמור, המכולה כבר מוצבת בפרויקט";
    this.Validation.containerExsitOnOtherProject ="לא ניתן לשמור, המכולה מוצבת בפרויקט אחר";
    this.Validation.TownIsMandatory ="יש לבחור ישוב לפני פעולה זו";
    this.Validation.pleaseCheckLocationOnMap ="לא ניתן לשמור, צריך לפתוח מפה ולבדוק נכונות מיקום";
    this.Validation.cannotOpenProjectOutOfArea ="לא ניתן לשמור, הפרויקט אינו בתחום הרשות";
    this.Validation.confirmSearchNewLocation ="האם ברצונך למצוא את המיקום במפה מחדש";
   
    this.HomePage = {};
    this.HomePage.title = "Eco Waste.NET Municipal";
    this.HomePage.actions = "תפריט פעולות";
    this.HomePage.line1 = ",שלום רב";
    this.HomePage.line2 = "המערכת בשלבי פיתוח";
    this.HomePage.line3 = "גרסה ניסיונית מספר"  +"1.0.0.2"
    this.HomePage.menu = "פתח תפריט";
    this.HomePage.users = "משתמשים";
    this.HomePage.containers = "מכולות";
    this.HomePage.authorities = "רשויות";
    this.HomePage.projects = " פרויקטי בנייה";
    this.HomePage.containerUnloading = "מעקב מכולות";
    this.HomePage.imeiUnloadingData ="בקרת פריקות";
    this.HomePage.infoPage = "אודות";
    this.HomePage.Alert = "התראות";
    this.HomePage.logout = "התנתק";
    this.HomePage.todo = "בפיתוח";
    this.HomePage.orders = "הזמנות";
    this.HomePage.supplierOrders = 'הזמנת ספק';

    this.Directions = { North: "צפון", northeast: " צפון מזרח ", East: "מזרח", southeast: " דרום מזרח", South: "דרום", southwest: "דרום מערב", West: "מערב", northwest: "צפון מערב " };
    
    this.Container = {};
    this.Container.info = "פרטי מכולה";
    this.Container.list = "מכולות";
    this.Container.form = " מכולה";
    this.Container.MapForm = "מיקום מכולה";
    this.Container.mapAllContainersTitle = "מפת כל המכולות";
    this.Container.movingCompanyTz =  "ח.פ. קבלן";
    this.Container.movingCompanyName ="שם קבלן";
    this.Container.regNum = "מספר מכולה";
    this.Container.imeiNumber = "מס' רכיב סוללרי";
    this.Container.totalvolume = "נפח";
    this.Container.allowedWeight = "משקל מותר";
    this.Container.tera = "טרה";
    this.Container.remarks = "הערות";
    this.Container.lastLat = "קו רוחב"; //latitude on map this is the actual y
    this.Container.lastLng = "קו גובה";//longitude on map this is the actual x--
    this.Container.locationDate = "תאריך עדכון מיקום";
    this.Container.containerColor = "צבע";
    this.Container.devicelocation = "מיקום מכשיר";
    this.Container.InstallationDate = "תאריך התקנה";
    this.Container.showEmptyBatary="הצג רק מכולות עם סוללה חלשה";
    this.Container.speed = "מהירות" + ": ";
    this.Container.speedUnit = "קמ\"ש";
    this.Container.direction = "כיוון";
    this.Container.tiltingType = "כלי אצירה";
    this.Container.tiltingTypeContainer = "מכולה";
    this.Container.tiltingTypeTruck = "משאית";
    this.Container.selectContainer = 'בחר מכולה';

    this.ContainerState = {};    
    this.ContainerState.status = "סטטוס מכולה";// + ":";
    this.ContainerState.statusAll = "הכל";
    this.ContainerState.statusMoving = "בנסיעה";
    this.ContainerState.statusOnProject = "בפרויקט";
    this.ContainerState.statusOutOfProject = "ללא איתור";
    this.ContainerState.statusOnWareHouse = "אתר אחסנה";

 
    this.Authority = {};
    this.Authority.moduleName="רשות";
    this.Authority.form = "טופס רישות";
    this.Authority.list="רשימת רשויות";
    this.Authority.authorityName = "שם רישות";
    this.Authority.latitudeUp = "קו אופקי עליון";
    this.Authority.latitudeDown = "קו אופקי תחתון";
    this.Authority.langitudeL = "קו רוחבי שמלי";
    this.Authority.langitudeR = "קו רוחבי ימני";
    this.Authority.remarks = "הערות";
    this.Authority.mainTab = "פרטי הרשות";
    this.Authority.mainTowns = "פרטי הרשות";

this.SupplierOrder={};
this.SupplierOrder.isConfirmed = "אושרה לתשלום";
this.SupplierOrder.ConfirmedTrueValue = "מאושר";
this.SupplierOrder.ConfirmedFalseValue = "לא מאושר";
this.SupplierOrder.confirmed = "מאושר לתשלום";
this.SupplierOrder.notConfirmed = "לא מאושר לתשלום";
this.SupplierOrder.movingCompanyInvoiceNumber = "מס' חש' לקבלן";
this.SupplierOrder.clientOrdering = "מקוון";
this.SupplierOrder.Date = "תאריך";
this.SupplierOrder.paymentAction = "פעולה";
this.SupplierOrder.addNewSupplierOrder = "הזמנה חדשה";
this.SupplierOrder.orderType = "סוג הזמנה";
this.SupplierOrder.orderSize = "גודל הזמנה";
this.SupplierOrder.form = "הזמנת מכולה";
this.SupplierOrder.clientType = "סוג לקוח ";
this.SupplierOrder.companyName = "";
this.SupplierOrder.contactPerson = "איש קשר לתיאום";
this.SupplierOrder.OrderAddress = "כתובת הצבת מכולה";
this.SupplierOrder.street = "רחוב";
this.SupplierOrder.houseNumber = "מס בית";
this.SupplierOrder.destructionApplicationNumber = "מספר בקשה להיתר הריסה ";
this.SupplierOrder.FieldType = "המכולה תוצב בשטח";
this.SupplierOrder.FieldTypePrivate = "פרטי ";
this.SupplierOrder.FieldTypePublic = "ציבורי";
this.SupplierOrder.CurationTools = "כלי אצירה";
this.SupplierOrder.container = "מכולה";
this.SupplierOrder.bala = "באלה ";
this.SupplierOrder.ContainerNumber = "כמות מכולות";
this.SupplierOrder.serviceSupplierName = "שם ספק שירות";
this.SupplierOrder.MaxNumOfContainerForOrder = "המספר המרבי של המכולות לכל הזמנה";
this.SupplierOrder.DefaultTimeToExitContainer = "זמן ברירת מחדל ליציאה ממכולות";
this.SupplierOrder.serviceSupplierType = "סוג ספק שירות";
this.SupplierOrder.prices = "מחירים";
this.SupplierOrder.containerVolume = " נפח המכולה";
this.SupplierOrder.PriceForDefaultPeriod = "מחיר לתקופת ברירת מחדל";
this.SupplierOrder.priceForExtraDay = "מחיר עבור יום נוסף";
this.SupplierOrder.isBala = "אם באלה ";
this.SupplierOrder.useBala = "תומך הזמנת באלה";
this.SupplierOrder.PricePerContainer = "מחיר למכולה";
this.SupplierOrder.PricePerBala = "מחיר לבאלה";
this.SupplierOrder.list = 'הזמנת ספק';
this.SupplierOrder.companyTZ = "ת.ז /ח.פ";
    this.SupplierOrder.ContainerOrder = "הזמנת מכולה";
    this.SupplierOrder.BalaOrder = "הזמנת באלה";
    this.SupplierOrder.changeLocationForContainer = "מיקום מכולה בפועל";
    this.SupplierOrder.serviceDetails = "פירות שירות";
    this.SupplierOrder.serviceDetailsBala = "פירות שירות באלה";
    this.SupplierOrder.clientType = "סוג לקוח ";
    this.SupplierOrder.companyName = "שם חברה";
    this.SupplierOrder.Title = "הזמנת ספק";
    this.SupplierOrder.serviceSupplierForm = "ספק שירות";
    this.SupplierOrder.contactTab = "איש קשר לתיאום";
    this.SupplierOrder.CurationToolsTab = "פרטי הזמנה";
    this.SupplierOrder.firstName = "שם פרטי";
    this.SupplierOrder.lastName = "שם משפחה";
    this.SupplierOrder.townId = "ישוב";
    this.SupplierOrder.containerCount = "מספר המכולות";
    this.SupplierOrder.balaCount = "מספר באלות";
    this.SupplierOrder.totalPrice = "המחיר הכולל";
    this.SupplierOrder.PrevioustotalPrice = "המחיר הכולל הקודם";
    this.SupplierOrder.expectedInsertDate = "תאריך הצבה צפוי";
    this.SupplierOrder.expectedExitDate = "תאריך יציאה צפוי";
    this.SupplierOrder.insertDate = "תאריך הצבה בפועל";
    this.SupplierOrder.exitDate = "תאריך יציאה בפועל";

    this.SupplierOrder.statusDesc = "סטָטוּס";
    this.SupplierOrder.additionalPrice = "מחיר נוסף";
    this.SupplierOrder.actionItemsTab = "פירוט פעולות";
    this.SupplierOrder.status = "סטטוס ההזמנה";
    this.SupplierOrder.AutoExChangeForContainers = "החלפה אוטומטית למכולות";
    this.SupplierOrder.MaxContainerNumberExceeded = "חריגה ממספר המכולות המרבי";
    this.SupplierOrder.TermsOfUseApproval = "אישור תנאי שימוש";
    this.SupplierOrder.actionItemInsert = "הצבה";
    this.SupplierOrder.actionItemExit = "הוצאה ";
    this.SupplierOrder.actionItemExchange = "החלפה";
    this.SupplierOrder.actionItemClosed = "בוצעה";
    this.SupplierOrder.ActionItemActions = "הפעולה הנדרשת";
    this.SupplierOrder.OrderDate = "תאריך הזמנה";
    this.SupplierOrder.HasMaxNumberOfBalaForOrder = "יש מספר מקסימום של באלה להזמנה";
    this.SupplierOrder.MaxNumOfBalaForOrder = "המספר המרבי של באלה להזמנה";
    this.SupplierOrder.action = "פירוט פעולות";
    this.SupplierOrder.addContainer = "להוסיף מכולה";
    this.SupplierOrder.selectExistingProject = "בחר פרויקט קיים";
    this.SupplierOrder.date = "תאריך";
    this.SupplierOrder.description = "תיאור";
    this.SupplierOrder.source = "";
    this.SupplierOrder.user = "משתמש";
    this.SupplierOrder.orderNumber = "מספר הזמנה";
    this.SupplierOrder.paymentNumber = "מספר חשבונית";
    this.SupplierOrder.numOfExtendedDays = "ימים נוספים";
    this.SupplierOrder.additionalTotalPrice = "סכום לימים נוספים";
    this.SupplierOrder.agreedTotalPrice = "סכום ששולם";
    this.SupplierOrder.paymentDetails = "פרטי תשלום";
    this.SupplierOrder.amoountToPay = "סכום לתשלום";
    this.SupplierOrder.ConfirmationOfExecution = "אישור ביצוע";
    this.SupplierOrder.amoutForDefualtPeriod = "סכום לתקופה שנקבעה";
    this.SupplierOrder.MovingCompanyNotSelected = "עדיין לא נבחר קבלן";
    this.SupplierOrder.MovingCompanySelected = "הקבלן כבר נבחר";
    this.SupplierOrder.numOfDaysToInsertFirstContainer = "מספר הימים להכנסת המכולה הראשון";
    this.SupplierOrder.BalaOrderType = "באלה";
    this.SupplierOrder.SupplierOrderType = "מכולה";
    this.SupplierOrder.filterCreationDate = "תאריך יצירה";
    this.SupplierOrder.creationDateFrom = "תאריך יצירה מתאריך";
    this.SupplierOrder.filterShowAllOrder = "להציג את כל ההזמנות";
    this.SupplierOrder.creationDateTo = "תאריך יצירה לתאריך";
    this.SupplierOrder.Council = "מועצה";
    this.SupplierOrder.SaveShippingCertificate = "שמור ת. משלוח";
    this.SupplierOrder.containerInSite = "יש מכולה באתר";
    this.SupplierOrder.nocontainerInSite = "אין מכולה באתר";
    this.SupplierOrder.projectHasOrder = "קיימת הזמנה לפרויקט";


    this.Project = {};
    this.Project.form = "פרויקט";
    this.Project.projectInfo = "פרטי פרויקט";
    this.Project.projectNew = "פרויקט חדש";
    this.Project.project_addContainer = "הצב בפרויקט קיים";
    this.Project.list = "פרויקטי בנייה";
    this.Project.projectId = "מס מערכת";
    this.Project.projectName = "שם פרויקט";
    this.Project.movingCompanyTz =  "ח.פ. קבלן";
    this.Project.movingCompanyName = "שם קבלן שינוע";
    this.Project.clientTz = "ת.ז. לקוח";
    this.Project.clientName = "שם לקוח";
    this.Project.clientPhone = "טלפון לקוח";
    this.Project.clientAddress = "כתובת לקוח";
    this.Project.projectTownId = "ישוב פרויקט";
    this.Project.projectAddress = "כתובת פרויקט";
    this.Project.buildingApprovalNumber = "מספר בקשת היתר בניה";
    this.Project.remarks = "הערות";
    this.Project.projectLat = "todo";
    this.Project.projectLng = "todo";
    this.Project.isActive = "האם פעיל";
    this.Project.startDate = "ת' התחלה";
    this.Project.endDate = "ת' סיום";
    this.Project.barCode = "בר קוד חוזה";
    this.Project.gosh = "גוש";
    this.Project.helka = "חלקה";
    this.Project.postalCode = "מיקוד";
    this.Project.projectType = "סוג בניה";
    this.Project.projectTypeOp1 = "חדש";
    this.Project.projectTypeOp2 = "שיפוץ";
    this.Project.projectTypeOp3 = "תשתיות";
    this.Project.projectTypeOp4 = "הריסה";
    this.Project.autoInsertTypeId = "סוג פרויקט";
    this.Project.autoInsertTypeIdOp1 = "רגיל";
    this.Project.autoInsertTypeIdOp2 = "שינוע";
    this.Project.autoInsertTypeIdOp3 = "העמסה ";
    this.Project.currentContainersTab = "מכולות  נוכחיות באתר";
    this.Project.historicalContainersTab = "היסטורית מכולות";
    this.Project.clientInfo = "פרטי לקוח";
    this.Project.ProectDataTab = "פרטי פרויקט";
    this.Project.remarkTab = "הערות";
    this.Project.containers = "מכולות";
    this.Project.createdBy = "שם מדווח";
    this.Project.inspectorId = "מפקח";
    
    this.ProjectContainer = {};
    this.ProjectContainer.ProjectContainerform = "הצבת מכולה חדשה";
    this.ProjectContainer.projectId = "פרויקט";
    this.ProjectContainer.containerId = "מכולה";
    this.ProjectContainer.insertDate = "תאריך הצבה";
    this.ProjectContainer.existDate = "תאריך הוצאה";
    this.ProjectContainer.remarks = "הערות";
    this.ProjectContainer.regNum = "מספר מכולה";
    this.ProjectContainer.exitContainerConfirmation = "האם לפנות את המכולה מאתר" + " ? ";
    this.ProjectContainer.projectContainer="מכולות באתר";
    this.ProjectContainer.projectContainerHistirical="מכולות שפונו מהאתר";
    this.ProjectContainer.ShowProjectContainerHistirical="הצג מכולות שפונו מהתאר";
    this.ProjectContainer.add="הצבת מכולה חדשה";
    this.ProjectContainer.exitConfirmation="האם לפנות את המכולה מאתר";
    this.ProjectContainer.insertConfirmation="האם להציב מכולה באתר הנבחר";
    this.ProjectContainer.createdBy = "שם מדווח";

    this.ContainerUnloading = {};
    this.ContainerUnloading.list = "מעקב מכולות";
    this.ContainerUnloading.form = "מעקב מכולות";
    this.ContainerUnloading.containerUnloadingId = "מספר מזהה לפריקה";
    this.ContainerUnloading.containerId = "מספר מזהה מכולה";
    this.ContainerUnloading.wasteSiteId = "אתר פריקה";
    this.ContainerUnloading.projectId = "מס' פרויקט";
    this.ContainerUnloading.regNum = "מספר מכולה";
    this.ContainerUnloading.volume = "נפח";
    this.ContainerUnloading.weight = "משקל";
    this.ContainerUnloading.unloadingdate = "מועד פריקה";
    this.ContainerUnloading.remarks = "הערות";
    this.ContainerUnloading.movingCompanyTz = "ח.פ. קבלן";
    this.ContainerUnloading.driverName="שם נהג";
    this.ContainerUnloading.unloadingDetails="נתוני פריקה";
    this.ContainerUnloading.unloadingDetailsDevice="נתוני פריקה" + " " + "(" + "מכשיר"+")";
    this.ContainerUnloading.wasteSiteName_auto = "אתר פריקה" + " " + "(" + "מכשיר"+")";
    this.ContainerUnloading.unloadingdate_automatic = "מועד פריקה" + " " + "(" + "מכשיר" + ")";
    this.ContainerUnloading.notonWasteSiteWhenEdit = "המכולה לא היתה באתר פריקה בעת עדכון משקל";


    this.ImeiUnloadingData = {};
    this.ImeiUnloadingData.list = "בקרת פריקות";
    this.ImeiUnloadingData.form = " פריקה לפי מכשיר בקרה";
    this.ImeiUnloadingData.containerUnloadingId = "מספר מזהה לפריקה";
    this.ImeiUnloadingData.containerId = "מספר מזהה מכולה";
    this.ImeiUnloadingData.wasteSiteId = "אתר פריקה";
    this.ImeiUnloadingData.projectId = "מס' פרויקט";
    this.ImeiUnloadingData.regNum = "מספר מכולה";    
    this.ImeiUnloadingData.trigerDate = "תאריך פריקה";    
    this.ImeiUnloadingData.movingCompanyTz =  "ח.פ. קבלן";


    
    
    this.Alert = {};
    this.Alert.form = "פרטי התראה";
    this.Alert.list = "התראות";       
    this.Alert.alertDate = "תאריך התראה";
    this.Alert.address = "כתובת";    
    this.Alert.clearReasonDesc = "סטאטוס התראה";
    this.Alert.cleardate = "תאריך טיפול";
    this.Alert.remarks = "הערות";
    this.Alert.alertTypeDesc = "סוג התראה";
    this.Alert.UnloadingPath = "מסלול לפריקה";
    this.Alert.stoppingTime =  "זמן עצירה";


    this.Client = {};
    this.Client.list = "לקוחות";
    this.Client.clientTz = "ת.ז/ח.פ לקוח";
    this.Client.clientName = "שם לקוח";
    this.Client.clientPhone = "טלפון ";
    this.Client.clientAddress = "כתובת ";
    this.Client.form = "לקוח";
    this.Client.email = "מיל";
    this.Client.city = "עיר";
    this.Client.street = "רחוב";
    this.Client.postalCode = "מיקוד";
    this.Client.postlCode = "מיקוד";
    this.Client.remarks = "הערות";
    this.Client.clientExtNumber = "מספר לקוח";
    this.Client.contactPerson = "איש קשר";

    this.Order = {};
    this.Order.list = "הזמנות";
    this.Order.showAllOrders = "הצג כל ההזמנות";
    this.Order.form = "הזמנה";
    this.Order.driverId = "נהג";
    this.Order.showAllContainer = "הצג את כל המכולות";
    this.Order.status = "סטטוס הזמנה";// + ":";
    this.Order.orderDate = "תאריך מיועד";
    this.Order.createdDate = "תאריך יצירה";
    this.Order.receiveTab = "תהליך הקבלה";
    this.Order.receiverName = "שם המקבל";
    this.Order.receiveDate = "תאריך קבלה";
    this.Order.orderNumber = "מספר הזמנה";
    this.Order.orderVolume = "נפח הזמנה";
    this.Order.containerVolume = "נפח מכולה";
    this.Order.statusAll = "הצג הכל";
    this.Order.statusNew = "חדש";
    this.Order.statusAssigned = "מוקצה";
    this.Order.statusAccepted = "התקבלה";
    this.Order.statusFromMobile = "הזמנת נייד";
    this.Order.remarks = "הערות";
    this.Order.regNum ="מכולה";
    this.Order.isSigned ="חתימת קבלה";
    this.Order.vehicleRegNum ="מספר רישוי רכב";
    
    this.Order.orderType = "סוג הזמנה";
    this.Order.orderTypeInsert = "הצבה";
    this.Order.orderTypeExit = "פינוי";
    this.Order.orderTypeExchange = "החלפה";

//check if need to load other langage

    if (appLanguage == 'Eng')
      this.loadEng();


   }






//Eng









loadEng() {

    this.currentLang='Eng';
    this.General = {};
    this.General.select = "Select entry";//-- v22
    this.General.save = "Save";
    this.General.back = "Close";
    this.General.update = "Update";
    this.General.view = "View";
    this.General.map = "Map";
    this.General.goBack = "Back";
    this.General.edit = "Edit";
    this.General.goto = "Lod Data";
    this.General.clean = "Clean";
    this.General.cleanAndNew = "Clean and new";
    this.General.duplicate = "Duplicate";
    this.General.search = "Search";
    this.General.new = "New";
    this.General.delete = "Delete";
    this.General.cancel = "Cancel";
    this.General.backAndCancel = "Cancel";
    this.General.searchModuleTitle = "Search";
    this.General.name = "Name";
    this.General.select = "Select";
    this.General.name = "Name";
    this.General.typeToSearch = "Type here to search"; 
    this.General.yes = "Yes";
    this.General.no = "No";
    this.General.manager = "Manager";
    this.General.fromDate = "From date";
    this.General.toDate = "To date";    
    this.General.refresh ="  "; //"Refresh";
    this.General.confirmDelete = "Are you sure you want to delete the selected item?";
    this.General.confirmCancel = "Do you wish to cancel the current action?";
    this.General.text2search = "Free text";    
    this.General.next = " continue";
    this.General.submit = " End";
    this.General.saveComplete = "Action completed";
    this.General.noGPSdata = "No GPS Data";
    this.General.mapHistory = "";//Track/History ";//"דיווחים ישנים";
    this.General.select2Date = "dates";
    this.General.exitContainer = "Exit Container";
    this.General.exitContainerFromProject = "Remove Container";
    this.General.onDate = "Date";
    this.General.mapAllContainers = "";
    this.General.ShowfilterOptions = " ";//"סנון";
    this.General.to = " to ";        
    this.General.filter = " Filter ";  
    this.General.cancelfilter = " Cancel ";  
    this.General.waseIt = "Waze it";  
    this.General.showActions = "Actions";  
    this.General.actions = "Actions"; 
    this.General.actionCompleted = "Action completed";
    this.General.cancelSearch = " Cancel ";
    this.General.hours = "Hours";
    this.General.minutes = "Minutes";
    this.General.notSelect = "notSelect";
    this.General.cancelSelected = "Cancel Select";
    this.General.NoPermision = "NoPermision";
    this.General.sign ="Sign";

    this.General.findInArround ="find in arround";

    this.General.filterWeightNotFilled = "No weight ";
    this.General.filterUnloaded = " Exit weight ";
    this.General.currentMap = "Current Map";
    this.General.historicalMap = "Track/History";
    
     
    this.General.Insert2Project = "Place Container"; 
    this.General.Insert2ProjectMainList = "Place"; 
    this.General.ShowAlsoNotActive = "Show Inactive";
    this.General.findLocation = "Find location";
    this.General.typeLocation = "Type location"; 
    
    
    this.General.green = "Green";
    this.General.yellow = "Yellow";
    this.General.red = "Red";
    this.General.blue = "Blue";
    this.General.black = "Black";
    this.General.aqua = "Light Blue";
    this.General.white = "White";
    
    this.General.orange = "Orange";
    this.General.crimson =  "Crimson";
    this.General.brown ="Brown";
    this.General.grey = "Grey";
    this.General.pink =  "Pink";
    this.General.purple = "Purple";
    this.General.khaki =  "Khaki";
    this.General.teal = "Teal";
    this.General.turquoise =  "Turquoise";
    this.General.indigo = "Indigo";
    this.General.cyan = "Cyan";
    this.General.Maroon = "Maroon";
    this.General.Magenta =  "Magenta";
    this.General.Silver = "Silver";
    this.General.SelectingTown = "Select  municipality / town";
    this.General.NotInsideAuthorityAreaMsg = "Not Inside Authority Area ";//" "Exceeds municipal area";"
    this.General.Loading = "Loading";
    this.General.NoData = "No data to display";
    this.General.M3 = "(M3)";
    this.Directions={};
    this.Directions = { North: "North", northeast: " Northeast ", East: "East", southeast: " Southeast", South: "South", southwest: "Southwest", West: "West", northwest: "Northwest " };


    this.Validation = {};
    this.Validation.Mandatory = "Please fill all required fields";
    this.Validation.InCorrectEmail = "Invalid email address";
    this.Validation.SelectSite = "Select a waste disposal site";
    this.Validation.SelectSiteAndAmount = "You must select a site and quantity and then continue";
    this.Validation.NonCorrect = "Invalid";
    this.Validation.submitFailObjectExist = "Cannot save. The data you entered already exists in the system";
    this.Validation.submitFail = "An error occurred";
    this.Validation.containerNotBelong2u = "Container does not belong to this user ";
    this.Validation.containerNotExist = "Container is not defined ";
    this.Validation.containerExsitOnThisSite = "The container is already configured on this site ";
    this.Validation.containerExsitOnOtherProject = " The container is defined on another site ";
    this.Validation.TownIsMandatory ="Please choose municipality / town";
    this.Validation.pleaseCheckLocationOnMap ="Please specify a location on the map";
    this.Validation.cannotOpenProjectOutOfArea ="Can not be saved, the project is not within the municipality area";//"לא ניתן לשמור, הפרויקט אינו בתחום הרשות";

    this.Validation.confirmSearchNewLocation ="Do you want to find the map location again?";//"האם ברצונך למצוא את המיקום במפה מחדש";
    
   
    
    this.HomePage = {};
    this.HomePage.title = "Eco Waste.NET Municipal";
    this.HomePage.actions = "Actions";
    this.HomePage.line1 = ",שלום רב";
    this.HomePage.line2 = "המערכת בשלבי פיתוח";
    this.HomePage.line3 = "גרסה ניסיונית מספר"  +"1.0.0.2"
    this.HomePage.menu = "פתח תפריט";
    this.HomePage.users = "Users";
    this.HomePage.containers = "Containers";
    this.HomePage.authorities = "Authorities";
    this.HomePage.projects =  "Projects";
    this.HomePage.containerUnloading =  "Tracking Containers";
    this.HomePage.imeiUnloadingData ="Dumping Info";
    this.HomePage.infoPage = "About";
    this.HomePage.Alert = "Alerts";
    this.HomePage.logout ="Log out";
    this.HomePage.todo = "UnderContracion";
    this.HomePage.orders = "Orders";
    this.HomePage.supplierOrders = 'Suuplier Orders';
    
    this.Container = {};
    this.Container.info = "Container Details"
    this.Container.list = "Containers";
    this.Container.form = " Container";
    this.Container.MapForm ="Container Location";
    this.Container.mapAllContainersTitle ="Map of all containers";
    
    this.Container.movingCompanyTz =   "Contractor B.N";
    this.Container.movingCompanyName ="Contractor";
    this.Container.regNum = "Container number";
    this.Container.imeiNumber = "IMEI Number";
    this.Container.totalvolume = "Volume";
    this.Container.allowedWeight =  "Weight allowed";
    this.Container.tera =  "Terra";
    this.Container.remarks ="Remarks";

    this.Container.lastLat ="Latitude"; //latitude on map this is the actual y
    this.Container.lastLng = "Longitude";//longitude on map this is the actual x--
    this.Container.locationDate = "Last updated";
    this.Container.containerColor = "Colour";
    this.Container.devicelocation = "Location installed";
    this.Container.InstallationDate = "Installation Date";
    this.Container.showEmptyBatary="show just containers with low battery";
    this.Container.speed = "מהירות" + ": ";
    this.Container.speedUnit = "קמ\"ש";
    this.Container.direction = "כיוון";
    this.Container.tiltingType = "כלי אצירה";
    this.Container.tiltingTypeContainer = "מכולה";
    this.Container.tiltingTypeTruck = "משאית";
    this.Container.selectContainer = 'בחר מכולה';
    this.ContainerState = {};    
    this.ContainerState.status = "Container status";// + ":";
    this.ContainerState.statusAll ="All";
    this.ContainerState.statusMoving ="Moving";
    this.ContainerState.statusOnProject = "On project";
    this.ContainerState.statusOutOfProject = "No detection";
    this.ContainerState.statusOnWareHouse = "In Warehouse";

 
    this.Authority = {};
    this.Authority.form = "Municipality";
    this.Authority.list="Authorities List";
    this.Authority.moduleName="Municipality";
    this.Authority.authorityName = "Municipality name";
    this.Authority.latitudeUp = "Upper latitude";
    this.Authority.latitudeDown = "Bottom latitude";
    this.Authority.langitudeL = "Left longitude";
    this.Authority.langitudeR =  "Right longitude";
    this.Authority.remarks = "Remarks";
    this.Authority.mainTab = "Municipality Details";
    this.Authority.mainTowns = "Autority Details";

    this.SupplierOrder={};
    this.SupplierOrder.isConfirmed = "אושרה לתשלום";
    this.SupplierOrder.ConfirmedTrueValue = "מאושר";
    this.SupplierOrder.ConfirmedFalseValue = "לא מאושר";
    this.SupplierOrder.confirmed = "מאושר לתשלום";
    this.SupplierOrder.notConfirmed = "לא מאושר לתשלום";
    this.SupplierOrder.movingCompanyInvoiceNumber = "מס' חש' לקבלן";
    this.SupplierOrder.clientOrdering = "מקוון";
    this.SupplierOrder.Date = "תאריך";
    this.SupplierOrder.paymentAction = "פעולה";
    this.SupplierOrder.addNewSupplierOrder = "הזמנה חדשה";
    this.SupplierOrder.orderType = "סוג הזמנה";
    this.SupplierOrder.orderSize = "גודל הזמנה";
    this.SupplierOrder.form = "הזמנת מכולה";
    this.SupplierOrder.clientType = "סוג לקוח ";
    this.SupplierOrder.companyName = "";
    this.SupplierOrder.contactPerson = "איש קשר לתיאום";
    this.SupplierOrder.OrderAddress = "כתובת הצבת מכולה";
    this.SupplierOrder.street = "רחוב";
    this.SupplierOrder.houseNumber = "מס בית";
    this.SupplierOrder.destructionApplicationNumber = "מספר בקשה להיתר הריסה ";
    this.SupplierOrder.FieldType = "המכולה תוצב בשטח";
    this.SupplierOrder.FieldTypePrivate = "פרטי ";
    this.SupplierOrder.FieldTypePublic = "ציבורי";
    this.SupplierOrder.CurationTools = "כלי אצירה";
    this.SupplierOrder.container = "מכולה";
    this.SupplierOrder.bala = "באלה ";
    this.SupplierOrder.ContainerNumber = "כמות מכולות";
    this.SupplierOrder.serviceSupplierName = "שם ספק שירות";
    this.SupplierOrder.MaxNumOfContainerForOrder = "המספר המרבי של המכולות לכל הזמנה";
    this.SupplierOrder.DefaultTimeToExitContainer = "זמן ברירת מחדל ליציאה ממכולות";
    this.SupplierOrder.serviceSupplierType = "סוג ספק שירות";
    this.SupplierOrder.prices = "מחירים";
    this.SupplierOrder.containerVolume = " נפח המכולה";
    this.SupplierOrder.PriceForDefaultPeriod = "מחיר לתקופת ברירת מחדל";
    this.SupplierOrder.priceForExtraDay = "מחיר עבור יום נוסף";
    this.SupplierOrder.isBala = "אם באלה ";
    this.SupplierOrder.useBala = "תומך הזמנת באלה";
    this.SupplierOrder.PricePerContainer = "מחיר למכולה";
    this.SupplierOrder.PricePerBala = "מחיר לבאלה";

    this.SupplierOrder.list = ' Supplier Order';
    this.SupplierOrder.list = 'הזמנת ספק';
    this.SupplierOrder.companyTZ = "ת.ז /ח.פ";
    this.SupplierOrder.ContainerOrder = "הזמנת מכולה";
    this.SupplierOrder.BalaOrder = "הזמנת באלה";
    this.SupplierOrder.changeLocationForContainer = "מיקום מכולה בפועל";
    this.SupplierOrder.serviceDetails = "פירות שירות";
    this.SupplierOrder.serviceDetailsBala = "פירות שירות באלה";
    this.SupplierOrder.clientType = "סוג לקוח ";
    this.SupplierOrder.companyName = "שם חברה";
    this.SupplierOrder.Title = "הזמנת ספק";
    this.SupplierOrder.serviceSupplierForm = "ספק שירות";
    this.SupplierOrder.contactTab = "איש קשר לתיאום";
    this.SupplierOrder.CurationToolsTab = "פרטי הזמנה";
    this.SupplierOrder.firstName = "שם פרטי";
    this.SupplierOrder.lastName = "שם משפחה";
    this.SupplierOrder.townId = "ישוב";
    this.SupplierOrder.containerCount = "מספר המכולות";
    this.SupplierOrder.balaCount = "מספר באלות";
    this.SupplierOrder.totalPrice = "המחיר הכולל";
    this.SupplierOrder.PrevioustotalPrice = "המחיר הכולל הקודם";
    this.SupplierOrder.expectedInsertDate = "תאריך הצבה צפוי";
    this.SupplierOrder.expectedExitDate = "תאריך יציאה צפוי";
    this.SupplierOrder.insertDate = "תאריך הצבה בפועל";
    this.SupplierOrder.exitDate = "תאריך יציאה בפועל";

    this.SupplierOrder.statusDesc = "סטָטוּס";
    this.SupplierOrder.additionalPrice = "מחיר נוסף";
    this.SupplierOrder.actionItemsTab = "פירוט פעולות";
    this.SupplierOrder.status = "סטטוס ההזמנה";
    this.SupplierOrder.AutoExChangeForContainers = "החלפה אוטומטית למכולות";
    this.SupplierOrder.MaxContainerNumberExceeded = "חריגה ממספר המכולות המרבי";
    this.SupplierOrder.TermsOfUseApproval = "אישור תנאי שימוש";
    this.SupplierOrder.actionItemInsert = "הצבה";
    this.SupplierOrder.actionItemExit = "הוצאה ";
    this.SupplierOrder.actionItemExchange = "החלפה";
    this.SupplierOrder.actionItemClosed = "בוצעה";
    this.SupplierOrder.ActionItemActions = "הפעולה הנדרשת";
    this.SupplierOrder.OrderDate = "תאריך הזמנה";
    this.SupplierOrder.HasMaxNumberOfBalaForOrder = "יש מספר מקסימום של באלה להזמנה";
    this.SupplierOrder.MaxNumOfBalaForOrder = "המספר המרבי של באלה להזמנה";
    this.SupplierOrder.action = "פירוט פעולות";
    this.SupplierOrder.addContainer = "להוסיף מכולה";
    this.SupplierOrder.selectExistingProject = "בחר פרויקט קיים";
    this.SupplierOrder.date = "תאריך";
    this.SupplierOrder.description = "תיאור";
    this.SupplierOrder.source = "";
    this.SupplierOrder.user = "משתמש";
    this.SupplierOrder.orderNumber = "מספר הזמנה";
    this.SupplierOrder.paymentNumber = "מספר חשבונית";
    this.SupplierOrder.numOfExtendedDays = "ימים נוספים";
    this.SupplierOrder.additionalTotalPrice = "סכום לימים נוספים";
    this.SupplierOrder.agreedTotalPrice = "סכום ששולם";
    this.SupplierOrder.paymentDetails = "פרטי תשלום";
    this.SupplierOrder.amoountToPay = "סכום לתשלום";
    this.SupplierOrder.ConfirmationOfExecution = "אישור ביצוע";
    this.SupplierOrder.amoutForDefualtPeriod = "סכום לתקופה שנקבעה";
    this.SupplierOrder.MovingCompanyNotSelected = "עדיין לא נבחר קבלן";
    this.SupplierOrder.MovingCompanySelected = "הקבלן כבר נבחר";
    this.SupplierOrder.numOfDaysToInsertFirstContainer = "מספר הימים להכנסת המכולה הראשון";
    this.SupplierOrder.BalaOrderType = "באלה";
    this.SupplierOrder.SupplierOrderType = "מכולה";
    this.SupplierOrder.filterCreationDate = "תאריך יצירה";
    this.SupplierOrder.creationDateFrom = "תאריך יצירה מתאריך";
    this.SupplierOrder.filterShowAllOrder = "להציג את כל ההזמנות";
    this.SupplierOrder.creationDateTo = "תאריך יצירה לתאריך";
    this.SupplierOrder.Council = "מועצה";
    this.SupplierOrder.SaveShippingCertificate = "שמור ת. משלוח";
    this.SupplierOrder.containerInSite = "יש מכולה באתר";
    this.SupplierOrder.nocontainerInSite = "אין מכולה באתר";
    this.SupplierOrder.projectHasOrder = "קיימת הזמנה לפרויקט";



    this.Project = {};
    this.Project.form = "Project";
    this.Project.projectInfo = "Project Details";
    this.Project.projectNew = "New project";
    this.Project.project_addContainer = "Add to existing project";
    
    this.Project.list =  "Projects";
    this.Project.projectId = "Project number";
    this.Project.projectName = "Project name";
    this.Project.movingCompanyTz =  "Contractor B.N";
    this.Project.movingCompanyName = "Contractor";
    this.Project.clientTz =  "Client I.D";
    this.Project.clientName = "Client";
    this.Project.clientPhone = "Phone ";
    this.Project.clientAddress = "Address ";
    this.Project.projectTownId = "Project town";
    this.Project.projectAddress =  "Project address";
    this.Project.buildingApprovalNumber = "Building permit request number";
    this.Project.remarks =  "Remarks";
    this.Project.projectLat = "Latitude";
    this.Project.projectLng = "Longitude";
    this.Project.isActive ="Active";
    this.Project.startDate ="Start date";
    this.Project.endDate = "End date ";
    this.Project.barCode = "Contract barcode";
    this.Project.gosh = "Block";
    this.Project.helka = "Parcel";
    this.Project.postalCode = "Postal code";
    this.Project.projectType =  "Building type";
    this.Project.projectTypeOp1 = "New";
    this.Project.projectTypeOp2 =  "Renovation";
    this.Project.projectTypeOp3 = "Infrastructure";
    this.Project.projectTypeOp4 = "Demolition";


    this.Project.autoInsertTypeId = "Project type";
    this.Project.autoInsertTypeIdOp1 ="Regular";
    this.Project.autoInsertTypeIdOp2 = "Transport";
    this.Project.autoInsertTypeIdOp3 = "Loading";

    this.Project.currentContainersTab = "Container placement /removal";
    this.Project.historicalContainersTab = "Container history";

    this.Project.clientInfo = "Customer Details";
    this.Project.ProectDataTab = "Project Details";
    this.Project.remarkTab = "Remarks";
    this.Project.containers = "Containers";
    this.Project.createdBy ="Reporter";
    this.Project.inspectorId = "Inspector";
    

    this.ProjectContainer = {};
    this.ProjectContainer.ProjectContainerform = "New container placement";
    this.ProjectContainer.projectId = "Project";
    this.ProjectContainer.containerId = "Container";
    this.ProjectContainer.insertDate = "Placement date";
    this.ProjectContainer.existDate = "Removal date";
    this.ProjectContainer.remarks = "Remarks";
    this.ProjectContainer.regNum =  "#"+"Container";
    this.ProjectContainer.exitContainerConfirmation =  "Do you want to remove the container?" ;
    this.ProjectContainer.projectContainer = "Containers on site";
    this.ProjectContainer.projectContainerHistirical="Containers evacuated from the site";
    this.ProjectContainer.ShowProjectContainerHistirical="Show evacuated containers ";
    this.ProjectContainer.add="Place new container";
    this.ProjectContainer.exitConfirmation= "Do you want to remove the container?" ;
    this.ProjectContainer.insertConfirmation="Do you want to add container to the selected Site";
    this.ProjectContainer.createdBy = "Reporter";

    this.ContainerUnloading = {};
    this.ContainerUnloading.list = "Container tracking";
    this.ContainerUnloading.form = "Container tracking";
    this.ContainerUnloading.containerUnloadingId = "Dumping ID number";  
    this.ContainerUnloading.containerId = "Container ID number";
    this.ContainerUnloading.wasteSiteId =  "Dumping site";
    this.ContainerUnloading.projectId = "Project number";
    this.ContainerUnloading.regNum ="Container number";    
    this.ContainerUnloading.volume = "Volume (m3)";
    this.ContainerUnloading.weight = "Net-Weight (tons)";
    this.ContainerUnloading.unloadingdate = "Dumping time";
    this.ContainerUnloading.remarks =  "Remarks";
    this.ContainerUnloading.movingCompanyTz = "Contractor B.N";
    this.ContainerUnloading.driverName="Driver name";
    this.ContainerUnloading.unloadingDetails="Unloading Details";
    
    this.ContainerUnloading.unloadingDetailsDevice="Unloading details" + " " + "(" + "Device"+")";
    this.ContainerUnloading.wasteSiteName_auto = " Dumping site (device)";  
    this.ContainerUnloading.unloadingdate_automatic = " Dumping time (device)";

    this.ContainerUnloading.notonWasteSiteWhenEdit = "Container wasn't in dumping site when the weight was updated ";


    this.ImeiUnloadingData = {};
    this.ImeiUnloadingData.list = "Dumping Info";
    this.ImeiUnloadingData.form = " Dumping Info according device";
    this.ImeiUnloadingData.containerUnloadingId = "Dumping ID number";  
    this.ImeiUnloadingData.containerId = "Container ID number";
    this.ImeiUnloadingData.wasteSiteId = "Dumping site";
    this.ImeiUnloadingData.projectId ="Project number";
    this.ImeiUnloadingData.regNum = "Container number";    
    this.ImeiUnloadingData.trigerDate = "Dumping date";  
    this.ImeiUnloadingData.movingCompanyTz = "Contractor B.N";


    
    this.Alert = {};
    this.Alert = {};
    this.Alert.form =" Alert";
    this.Alert.list = "Alerts";       
    this.Alert.alertDate =  "Alert date";
    this.Alert.address =  "Address";    
    this.Alert.clearReasonDesc = "Alert status";
    this.Alert.cleardate = "Handling date";
    this.Alert.remarks = "Remarks";
    this.Alert.alertTypeDesc = "Alert type";

    this.Alert.stoppingTime =  "Stopping time";



    this.Client = {};
    this.Client.list = "Client List";
    this.Client.clientTz = "Client Identity";
    this.Client.clientName = "Client Name";
    this.Client.clientPhone = "Phone ";
    this.Client.clientAddress = "Address ";
    this.Client.form = "Client";
    this.Client.city = "Town";
    this.Client.street = "Street";
    this.Client.postalCode = "Postal Code";
    this.Client.postlCode = "Postal Code";
    this.Client.clientExtNumber = "Number On SAP";
    this.Client.email="Email";
    this.Client.remarks ="Remakrs";
    this.Client.contactPerson = "Contact Person";


    this.Order = {};
    this.Order.list = "Orders";
    this.Order.showAllOrders = "Show All Orders";
    this.Order.form = "Order Form";
    this.Order.driverId = "Driver";
    this.Order.showAllContainer = "Show All Containers";
    this.Order.status = "Status";// + ":";
    this.Order.orderDate = "orderDate";
    this.Order.createdDate = "Create Date"
    this.Order.receiveTab = "Receive Tab"
    this.Order.receiverName = "Receiver Name"
    this.Order.receiveDate = "receiveDate"
    this.Order.orderNumber ="Order Number"
    this.Order.orderVolume = "Order Volume"
    this.Order.containerVolume ="Containe Volume";
    this.Order.statusAll = "Status All";
    this.Order.statusNew = "Status New";
    this.Order.statusAssigned = "Status Assigned";
    this.Order.statusAccepted = "Status Accepted";
    this.Order.statusFromMobile = "Status FromMobile";
    this.Order.remarks ="Remakrs";
    this.Order.regNum ="RegNum";
    this.Order.isSigned ="isSigned";
    this.Order.vehicleRegNum ="vehicleNumber";
    this.Order.orderType = "Order type";
    this.Order.orderTypeInsert = "Insert";
    this.Order.orderTypeExit = "Exit";
    this.Order.orderTypeExchange = "Exchange";

   }









}
 