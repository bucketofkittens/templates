<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Новости");
?>
<div class="content-inner"> <?$APPLICATION->IncludeComponent(
	"bitrix:menu",
	"",
	Array(
		"ROOT_MENU_TYPE" => "left",
		"MAX_LEVEL" => "1",
		"CHILD_MENU_TYPE" => "left",
		"USE_EXT" => "N",
		"DELAY" => "N",
		"ALLOW_MULTI_SELECT" => "N",
		"MENU_CACHE_TYPE" => "N",
		"MENU_CACHE_TIME" => "3600",
		"MENU_CACHE_USE_GROUPS" => "Y",
		"MENU_CACHE_GET_VARS" => ""
	),
false
);?>
<div class="newsdate">
	<?
	setlocale(LC_ALL, 'ru_RU.UTF-8');
	$currentAge =  date("Y", time());
	$currentMonth =  date("n", time());
	if(isset($_GET["MONTH"])) {
		$currentMonth = $_GET["MONTH"];
	}
	if(isset($_GET["AGE"])) {
		$currentAge = $_GET["AGE"];
	}
	$month_name = array (1 => "Январь", 2 => "Февраль", 3 => "Март", 4 => "Апрель", 5 => "Май", 6 => "Июнь", 7 => "Июль", 8 => "Август", 9 => "Сентябрь", 10 => "Октябрь", 11 => "Ноябрь", 12 => "Декабрь");
	$currentMonthName =  $month_name[$currentMonth]; 
	?>
<? 
$currentMonthF = $currentMonth;
if(strlen($currentMonth) < 2) {
	$currentMonthF = "0".$currentMonth;
}
$GLOBALS['arrFilter'] =  array (
">=DATE_CREATE" => ConvertDateTime($currentAge."-".$currentMonthF."-01", "YYYY-MM-DD")." 00:00:00",
"<=DATE_CREATE" => ConvertDateTime($currentAge."-".$currentMonthF."-32", "YYYY-MM-DD")." 23:59:59",
);
array("DATE_CREATE"=>"*-".$currentMonth."-*");
?>
			<a href="?MONTH=<? echo($currentMonth); ?>&AGE=<? echo($currentAge-1); ?>" ><? echo($currentAge-1); ?></a>
            <span class="current"><? echo($currentAge); ?></span>            
            <a href="?MONTH=<? echo($currentMonth); ?>&AGE=<? echo($currentAge+1); ?>" ><? echo($currentAge+1); ?></a>
            <div class="month">
             <? if($currentMonth > 1) { ?>
              	<a class="back" href="?MONTH=<? echo($currentMonth-1)?>&AGE=<? echo($currentAge); ?>"></a>
              <? } else { ?>
              	<span class="back hiden" ></span> 
              <? } ?>
              <p class="currentMonth"><? echo($currentMonthName); ?></p>
              <? if($currentMonth < 12) { ?>
              	<a class="then" href="?MONTH=<? echo($currentMonth+1); ?>&AGE=<? echo($currentAge); ?>"></a>
              <? } else { ?>
              	<span class="then hiden" ></span>
              <? } ?>
          </div>
          </div>
        </div>
    
 
  <div class="about"> 
    <div class="content-inner"> 			<?$APPLICATION->IncludeComponent(
	"bitrix:news.list",
	"newslist",
	Array(
		"IBLOCK_TYPE" => "NEWS",
		"IBLOCK_ID" => "1",
		"NEWS_COUNT" => "20",
		"SORT_BY1" => "ACTIVE_FROM",
		"SORT_ORDER1" => "DESC",
		"SORT_BY2" => "SORT",
		"SORT_ORDER2" => "ASC",
		"FILTER_NAME" => "",
		"FIELD_CODE" => array(0=>"",1=>"",),
		"PROPERTY_CODE" => array(0=>"",1=>"",),
		"CHECK_DATES" => "Y",
		"DETAIL_URL" => "/about/news_item.php?ID=#ELEMENT_ID#",
		"AJAX_MODE" => "Y",
		"AJAX_OPTION_JUMP" => "Y",
		"AJAX_OPTION_STYLE" => "Y",
		"AJAX_OPTION_HISTORY" => "N",
		"CACHE_TYPE" => "A",
		"CACHE_TIME" => "36000000",
		"CACHE_FILTER" => "N",
		"CACHE_GROUPS" => "N",
		"PREVIEW_TRUNCATE_LEN" => "",
		"ACTIVE_DATE_FORMAT" => "d.m.Y",
		"SET_TITLE" => "Y",
		"SET_STATUS_404" => "N",
		"INCLUDE_IBLOCK_INTO_CHAIN" => "Y",
		"ADD_SECTIONS_CHAIN" => "Y",
		"HIDE_LINK_WHEN_NO_DETAIL" => "N",
		"PARENT_SECTION" => "",
		"PARENT_SECTION_CODE" => "",
		"DISPLAY_TOP_PAGER" => "N",
		"DISPLAY_BOTTOM_PAGER" => "Y",
		"PAGER_TITLE" => "Новости",
		"PAGER_SHOW_ALWAYS" => "Y",
		"PAGER_TEMPLATE" => "",
		"PAGER_DESC_NUMBERING" => "N",
		"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
		"PAGER_SHOW_ALL" => "Y",
		"DISPLAY_DATE" => "Y",
		"DISPLAY_NAME" => "Y",
		"DISPLAY_PICTURE" => "Y",
		"DISPLAY_PREVIEW_TEXT" => "Y",
		"AJAX_OPTION_ADDITIONAL" => "",
		"FILTER_NAME" => "arrFilter", 
	)
);?> 		</div>
   </div>
 </div>
 <?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>