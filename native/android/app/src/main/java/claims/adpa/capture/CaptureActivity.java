package claims.adpa.capture;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import android.view.View;
import android.widget.*;
import com.google.ar.core.*;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import org.json.*;

/** Development companion. Guided AR measurements are never represented as laser LiDAR. */
public final class CaptureActivity extends Activity {
    volatile Session session;
    private GLSurfaceView preview;
    private CaptureRenderer renderer;
    private TextView status;
    private EditText roomName, height;
    private Button mark, undo, export;
    private boolean installRequested=false, scanRequested=false;
    private String pendingExport;
    volatile boolean depthEnabled=false;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        LinearLayout layout=new LinearLayout(this);layout.setOrientation(LinearLayout.VERTICAL);layout.setPadding(18,18,18,18);
        TextView title=new TextView(this);title.setText("ADPA guided room capture - development");title.setTextSize(19);layout.addView(title);
        roomName=new EditText(this);roomName.setSingleLine(true);roomName.setHint("Room name");roomName.setText("Room 1");layout.addView(roomName);
        height=new EditText(this);height.setSingleLine(true);height.setHint("Field-measured room height (feet)");height.setInputType(android.text.InputType.TYPE_CLASS_NUMBER|android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL);layout.addView(height);
        status=new TextView(this);status.setText("Start the camera, then aim the center crosshair at each floor corner in order. Height must be measured separately. Nothing uploads automatically.");layout.addView(status);
        android.widget.FrameLayout frame=new android.widget.FrameLayout(this);
        preview=new GLSurfaceView(this);preview.setEGLContextClientVersion(2);preview.setPreserveEGLContextOnPause(true);
        renderer=new CaptureRenderer(this);preview.setRenderer(renderer);frame.addView(preview);
        TextView crosshair=new TextView(this);crosshair.setText("+");crosshair.setTextSize(32);crosshair.setTextColor(android.graphics.Color.WHITE);crosshair.setGravity(android.view.Gravity.CENTER);frame.addView(crosshair);
        layout.addView(frame,new LinearLayout.LayoutParams(-1,0,1));
        Button start=new Button(this);start.setText("Start / retry AR scan");start.setOnClickListener(v->{scanRequested=true;startSession();});layout.addView(start);
        LinearLayout actions=new LinearLayout(this);
        mark=new Button(this);mark.setText("Add floor corner");mark.setOnClickListener(v->preview.queueEvent(renderer::addCorner));actions.addView(mark,new LinearLayout.LayoutParams(0,-2,1));
        undo=new Button(this);undo.setText("Undo corner");undo.setOnClickListener(v->preview.queueEvent(renderer::undoCorner));actions.addView(undo,new LinearLayout.LayoutParams(0,-2,1));layout.addView(actions);
        export=new Button(this);export.setText("Export ADPA scan JSON");export.setOnClickListener(v->exportScan());layout.addView(export);
        setContentView(layout);setActive(false);
        if(state!=null)pendingExport=state.getString("pendingExport");
    }
    private void setActive(boolean active){mark.setEnabled(active);undo.setEnabled(active);export.setEnabled(active);}
    private void startSession(){
        ArCoreApk.Availability availability=ArCoreApk.getInstance().checkAvailability(this);
        if(availability.isTransient()){message("Checking ARCore support. Tap Start / retry again shortly.");return;}
        if(!availability.isSupported()){message("ARCore is unavailable on this device. Use ADPA photo/video and laser/tape measurements instead.");setActive(false);return;}
        if(checkSelfPermission(Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED){requestPermissions(new String[]{Manifest.permission.CAMERA},100);return;}
        try {
            if(session==null){
                if(ArCoreApk.getInstance().requestInstall(this,!installRequested)==ArCoreApk.InstallStatus.INSTALL_REQUESTED){installRequested=true;return;}
                session=new Session(this);
                Config config=new Config(session);config.setPlaneFindingMode(Config.PlaneFindingMode.HORIZONTAL);config.setFocusMode(Config.FocusMode.AUTO);
                depthEnabled=session.isDepthModeSupported(Config.DepthMode.AUTOMATIC);
                if(depthEnabled)config.setDepthMode(Config.DepthMode.AUTOMATIC);
                session.configure(config);
            }
            if(!renderer.running){session.resume();renderer.running=true;preview.onResume();}
            setActive(true);message(depthEnabled?"Depth enabled. Move slowly until a floor plane is tracked, then add corners in order.":"Depth unavailable: guided tracked-plane measurement. Move slowly until the floor is tracked.");
        }catch(Exception error){if(session!=null){session.close();session=null;}renderer.running=false;setActive(false);message("Camera/AR session could not start. Check permissions and ARCore installation, then retry. Manual capture remains available in ADPA.");}
    }
    void message(String text){runOnUiThread(()->status.setText(text));}
    private void exportScan(){
        List<float[]> points=renderer.snapshot;
        String name=roomName.getText().toString().trim();double feet;
        try{feet=Double.parseDouble(height.getText().toString());}catch(NumberFormatException e){message("Enter a separately measured height in feet.");return;}
        if(name.isEmpty()||name.length()>150||points.size()<3||!Double.isFinite(feet)||feet<=0||feet>100||!renderer.tracking){message("Name the room, enter a valid measured height, and capture at least 3 tracked floor corners.");return;}
        try{
            JSONArray polygon=new JSONArray();float[] origin=points.get(0);
            for(float[] point:points)polygon.put(new JSONObject().put("x",point[0]-origin[0]).put("z",point[2]-origin[2]));
            JSONObject room=new JSONObject().put("name",name).put("points",polygon).put("height",feet*0.3048).put("openingsArea",0).put("heightSource","Inspector-entered field measurement in feet").put("notes","");
            JSONObject scan=new JSONObject().put("version",2).put("scanId",UUID.randomUUID().toString()).put("provider",depthEnabled?"Android ARCore guided floor capture (Depth enabled)":"Android ARCore guided floor capture (tracked planes; no Depth)").put("captureMethod","android_arcore").put("units","m").put("capturedAt",Instant.now().toString()).put("warnings",new JSONArray(Arrays.asList("User-guided floor corners; field verification required.","Height was entered manually, not inferred from the floor scan.","No opening deductions applied. Inspect and enter deductions in ADPA.","Assumes a level floor, vertical walls and a level ceiling."))).put("rooms",new JSONArray().put(room));
            pendingExport=scan.toString(2);
            Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);intent.addCategory(Intent.CATEGORY_OPENABLE);intent.setType("application/json");intent.putExtra(Intent.EXTRA_TITLE,"adpa-scan.json");startActivityForResult(intent,200);
        }catch(JSONException e){message("Scan export failed. Retain field measurements and retry.");}
    }
    @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);if(request==200&&result==RESULT_OK&&data!=null&&data.getData()!=null&&pendingExport!=null){try(java.io.OutputStream output=getContentResolver().openOutputStream(data.getData())){if(output==null)throw new java.io.IOException();output.write(pendingExport.getBytes(StandardCharsets.UTF_8));pendingExport=null;message("Scan file saved. Import it in ADPA Inspection & Scope and verify the outline, height and quantities.");}catch(java.io.IOException e){message("Could not save the scan file. Retry export.");}}}
    @Override public void onRequestPermissionsResult(int request,String[] permissions,int[] grants){super.onRequestPermissionsResult(request,permissions,grants);if(request==100){if(grants.length>0&&grants[0]==PackageManager.PERMISSION_GRANTED)startSession();else message("Camera permission denied. ADPA manual measurements remain available.");}}
    @Override protected void onResume(){super.onResume();if(scanRequested)startSession();}
    @Override protected void onPause(){if(preview!=null)preview.onPause();if(session!=null)session.pause();if(renderer!=null){renderer.running=false;renderer.tracking=false;}super.onPause();}
    @Override protected void onDestroy(){if(session!=null){session.close();session=null;}super.onDestroy();}
    @Override protected void onSaveInstanceState(Bundle state){super.onSaveInstanceState(state);state.putString("pendingExport",pendingExport);}
}
