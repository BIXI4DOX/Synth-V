function getClientInfo() {
  return {
    "name": SV.T("Move Notes Left & Scroll To Notes"),
    "category": "Notes",
    "author": "https://github.com/BIXI4DOX/Synth-V/tree/main",
    "versionNumber": 1,
    "minEditorVersion": 65537
  }
}



//////////////////////////////////////////
//										//
//	Also has Scroll To Selected Notes.	//
//										//
//////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// moves the piano roll viewport so the current selection is visible														//
// SCRIPT_TITLE = "Scroll To Selection Start";																				//
// 																															//
// From script "ScrollToSelectionStart", intergrated into this script.														//
// These are the variables needed to run the ViewPort function.																//
// > BIXI																													//
																															//
// desired number of pixels between the left side of the screen and the start of the selection								//
var OFFSET_H = 200;																											//
																															//
// number of pitches to offset vertical scrolling																			//
// negative values can be helpful for positioning the selection above the parameter panel instead of being blocked by it	//
var OFFSET_V = 0 //-6;																										//
																															//
// whether to scroll horizontally and vertically																			//
// if you want separate scripts/hotkeys for each, copy the script and modify these to your liking							//
var SCROLL_H = true;																										//
var SCROLL_V = true;																										//
																															//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// moves a selection left based on the current snap setting (or a specified distance)															//
// recommended hotkey: left arrow																												//
// SCRIPT_TITLE = "Move Notes Left & Scroll To Start";																							//
																																				//
// move distance based on current snap setting																									//
var MOVE_BY_SNAP_SETTING = true;																												//
																																				//
// snap the final note position to the grid																										//
// you might not want this if you're doing detailed timing work																					//
var SNAP_FINAL_POSITION = true;																													//
																																				//
// if SNAP_FINAL_POSITION is true, only snap the final position if it is close to the grid														//
// this is helpful if a note is intentionally offset by 25-50% of the current snap setting, so as not to override the user's timing changes		//
// for example, a note with 1/32 offset on a 1/8 or 1/16 grid is assumed to be intentional 														//
// and will not snap to the larger grid, but a 1/32 offset on a 1/4 grid will snap																//
// to always snap to grid, set it to 0.51 or higher																								//
// to never snap to grid, set it to 0 (or set SNAP_FINAL_POSITION to false)																		//
// to manually snap to the grid, use the built-in "Snap to Grid" function under the "Modify" menu												//
var SNAP_THRESHOLD = 0.25;																														//
																																				//
// if MOVE_BY_SNAP_SETTING is false, always move notes the specified distance																	//
// to move 1 measure at a time, change this to 4																								//
// to move 1/8 at a time, set it to 0.5																											//
var QUARTERS_TO_MOVE = 1;																														//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////
function move() {																					//
  var selection = SV.getMainEditor().getSelection();												//
  var selectedNotes = selection.getSelectedNotes();													//
  if (selectedNotes.length == 0) {																	//
    return;																							//
  }																									//
																									//
  var shiftBy;																						//
  var snapSetting = lib.getSnapSetting();															//
  if (MOVE_BY_SNAP_SETTING) {																		//
    shiftBy = snapSetting * -1;																		//
  } else {																							//
    shiftBy = QUARTERS_TO_MOVE * SV.QUARTER * -1;													//
  }																									//
																									//
  var snapDiff = 0;																					//
  for (var i = 0; i < selectedNotes.length; i++) {													//	
    var currOnset = selectedNotes[i].getOnset();													//
																									//
    // only perform snapping on the first note in selection, adjust all others by same amount		//
    if (i === 0 && SNAP_FINAL_POSITION) {															//
      var snappedOnset = lib.smartSnap(currOnset, snapSetting * SNAP_THRESHOLD);					//
      snapDiff = snappedOnset - currOnset;															//
																									//
      // if snapping already moved the note to the left, don't move an extra grid distance			//
      if (snapDiff < 0) {																			//
        shiftBy = 0;																				//
      }																								//
    }																								//
																									//
    var newOnset = currOnset + shiftBy;																//
    if (newOnset < 0) {																				//
      newOnset = 0;																					//
    }																								//
    selectedNotes[i].setOnset(newOnset + snapDiff);													//
  }																									//
}																									//
//////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////
//From script "ScrollToSelectionStart", intergrated into this script.								//
// BIXI DOX																							//
																									//
																									//
function scrollViewport() {																			//
  var editorView = SV.getMainEditor();																//
  var selection = editorView.getSelection();														//
  var viewport = editorView.getNavigation();														//
  var selectedNotes = selection.getSelectedNotes();													//
  if (selectedNotes.length == 0) {																	//
    return;																							//
  }																									//
																									//
  var targetNote = selectedNotes[0];																//
																									//
  if (SCROLL_H) {																					//
    var padding = OFFSET_H / viewport.getTimePxPerUnit();											//
    var targetLeft = targetNote.getOnset() - padding;												//
    if (targetLeft < 0) {																			//
      targetLeft = 0;																				//
    }																								//
    viewport.setTimeLeft(targetLeft);																//
  }																									//
																									//
  if (SCROLL_V) {																					//
    viewport.setValueCenter(targetNote.getPitch() + OFFSET_V);										//
  }																									//
}																									//
																									//
																									//
//////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////
					//
function main() {	//
  move();			//
  scrollViewport();	//
  SV.finish();		//
}					//
					//
//////////////////////

var lib=lib||{};
// Minified from https://github.com/claire-west/svstudio-scripts-dev/blob/main/reuse/getSnapSetting.js
lib.getSnapSetting=function(){for(var a=SV.getMainEditor().getNavigation(),b=0,c=1e7;0===b;c+=5e6)b=a.snap(b+c);return b};
// Minified from https://github.com/claire-west/svstudio-scripts-dev/blob/main/reuse/smartSnap.js
lib.smartSnap=function(a,b){var c=SV.getMainEditor().getNavigation(),d=c.snap(a);return Math.abs(a-d)<b?d:a};
