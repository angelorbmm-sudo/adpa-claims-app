package claims.adpa.capture;

import android.opengl.*;
import com.google.ar.core.*;
import java.nio.*;
import java.util.*;
import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

final class CaptureRenderer implements GLSurfaceView.Renderer {
    private final CaptureActivity owner;
    private int texture, background, marker, width=1,height=1;
    private Frame frame;
    private final List<Anchor> corners=new ArrayList<>();
    volatile List<float[]> snapshot=Collections.emptyList();
    volatile boolean tracking=false,running=false;
    private long lastMessage=0;
    private final FloatBuffer vertices=buffer(new float[]{-1,-1,1,-1,-1,1,1,1});
    private final FloatBuffer uv=buffer(new float[8]);
    CaptureRenderer(CaptureActivity owner){this.owner=owner;}
    private static FloatBuffer buffer(float[] data){FloatBuffer b=ByteBuffer.allocateDirect(data.length*4).order(ByteOrder.nativeOrder()).asFloatBuffer();b.put(data);b.position(0);return b;}
    private static int shader(int type,String source){int id=GLES20.glCreateShader(type);GLES20.glShaderSource(id,source);GLES20.glCompileShader(id);int[] ok={0};GLES20.glGetShaderiv(id,GLES20.GL_COMPILE_STATUS,ok,0);if(ok[0]==0)throw new IllegalStateException("Shader compilation failed");return id;}
    private static int program(String vertex,String fragment){int v=shader(GLES20.GL_VERTEX_SHADER,vertex),f=shader(GLES20.GL_FRAGMENT_SHADER,fragment),p=GLES20.glCreateProgram();GLES20.glAttachShader(p,v);GLES20.glAttachShader(p,f);GLES20.glLinkProgram(p);int[] ok={0};GLES20.glGetProgramiv(p,GLES20.GL_LINK_STATUS,ok,0);GLES20.glDeleteShader(v);GLES20.glDeleteShader(f);if(ok[0]==0)throw new IllegalStateException("Shader link failed");return p;}
    @Override public void onSurfaceCreated(GL10 gl,EGLConfig config){
        int[] textures={0};GLES20.glGenTextures(1,textures,0);texture=textures[0];GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,texture);GLES20.glTexParameteri(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,GLES20.GL_TEXTURE_MIN_FILTER,GLES20.GL_LINEAR);GLES20.glTexParameteri(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,GLES20.GL_TEXTURE_MAG_FILTER,GLES20.GL_LINEAR);GLES20.glTexParameteri(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,GLES20.GL_TEXTURE_WRAP_S,GLES20.GL_CLAMP_TO_EDGE);GLES20.glTexParameteri(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,GLES20.GL_TEXTURE_WRAP_T,GLES20.GL_CLAMP_TO_EDGE);
        background=program("attribute vec2 p;attribute vec2 t;varying vec2 uv;void main(){gl_Position=vec4(p,0.0,1.0);uv=t;}","#extension GL_OES_EGL_image_external : require\nprecision mediump float;uniform samplerExternalOES camera;varying vec2 uv;void main(){gl_FragColor=texture2D(camera,uv);}");
        marker=program("attribute vec3 p;uniform mat4 mvp;void main(){gl_Position=mvp*vec4(p,1.0);gl_PointSize=16.0;}","precision mediump float;void main(){gl_FragColor=vec4(0.0,1.0,0.7,1.0);}");
    }
    @Override public void onSurfaceChanged(GL10 gl,int width,int height){this.width=width;this.height=height;GLES20.glViewport(0,0,width,height);}
    @Override public void onDrawFrame(GL10 gl){
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT|GLES20.GL_DEPTH_BUFFER_BIT);Session session=owner.session;if(session==null||!running)return;
        try{
            session.setDisplayGeometry(owner.getWindowManager().getDefaultDisplay().getRotation(),width,height);session.setCameraTextureName(texture);frame=session.update();
            if(frame.getTimestamp()==0)return;
            frame.transformCoordinates2d(Coordinates2d.OPENGL_NORMALIZED_DEVICE_COORDINATES,vertices,Coordinates2d.TEXTURE_NORMALIZED,uv);
            GLES20.glDisable(GLES20.GL_DEPTH_TEST);GLES20.glUseProgram(background);GLES20.glActiveTexture(GLES20.GL_TEXTURE0);GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,texture);GLES20.glUniform1i(GLES20.glGetUniformLocation(background,"camera"),0);
            int p=GLES20.glGetAttribLocation(background,"p"),t=GLES20.glGetAttribLocation(background,"t");vertices.position(0);uv.position(0);GLES20.glVertexAttribPointer(p,2,GLES20.GL_FLOAT,false,0,vertices);GLES20.glVertexAttribPointer(t,2,GLES20.GL_FLOAT,false,0,uv);GLES20.glEnableVertexAttribArray(p);GLES20.glEnableVertexAttribArray(t);GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP,0,4);GLES20.glDisableVertexAttribArray(p);GLES20.glDisableVertexAttribArray(t);
            tracking=frame.getCamera().getTrackingState()==TrackingState.TRACKING&&corners.stream().allMatch(a->a.getTrackingState()==TrackingState.TRACKING);
            List<float[]> current=new ArrayList<>();for(Anchor anchor:corners)current.add(anchor.getPose().getTranslation());snapshot=Collections.unmodifiableList(current);
            if(!current.isEmpty())drawCorners(current);
            if(System.currentTimeMillis()-lastMessage>1000){owner.message((tracking?"Tracking floor. ":"Tracking paused - move slowly. ")+corners.size()+" corner(s). Aim + at the next floor corner; do not add the first corner twice.");lastMessage=System.currentTimeMillis();}
        }catch(Exception error){tracking=false;owner.message("AR tracking interrupted. Stop and retry or use manual measurements.");}
    }
    void addCorner(){
        if(frame==null||!tracking){owner.message("Wait for camera tracking and a floor plane.");return;}
        if(corners.size()>=100){owner.message("Maximum 100 corners. Split complex spaces into separate rooms.");return;}
        for(HitResult hit:frame.hitTest(width/2f,height/2f)){
            Trackable trackable=hit.getTrackable();
            boolean floor=trackable instanceof Plane&&((Plane)trackable).getType()==Plane.Type.HORIZONTAL_UPWARD_FACING&&((Plane)trackable).isPoseInPolygon(hit.getHitPose());
            // First corner establishes a horizontal floor plane; later depth hits must remain at its level.
            boolean depth=trackable instanceof DepthPoint&&!corners.isEmpty();
            if(!floor&&!depth)continue;
            float[] position=hit.getHitPose().getTranslation();
            if(!corners.isEmpty()){
                float[] base=corners.get(0).getPose().getTranslation();if(Math.abs(base[1]-position[1])>0.08)continue;
                boolean duplicate=false;for(Anchor anchor:corners){float[] other=anchor.getPose().getTranslation();if(Math.hypot(position[0]-other[0],position[2]-other[2])<0.03)duplicate=true;}if(duplicate){owner.message("That corner is already recorded. Use Undo to correct it.");return;}
            }
            corners.add(hit.createAnchor());owner.message("Corner added. Continue around the room in order.");return;
        }
        owner.message("No tracked floor corner at the crosshair. Move to improve the view, then retry.");
    }
    void undoCorner(){if(!corners.isEmpty())corners.remove(corners.size()-1).detach();}
    private void drawCorners(List<float[]> points){
        float[] view=new float[16],projection=new float[16],mvp=new float[16],positions=new float[points.size()*3];frame.getCamera().getViewMatrix(view,0);frame.getCamera().getProjectionMatrix(projection,0,0.1f,100f);Matrix.multiplyMM(mvp,0,projection,0,view,0);for(int i=0;i<points.size();i++)System.arraycopy(points.get(i),0,positions,i*3,3);
        GLES20.glUseProgram(marker);GLES20.glUniformMatrix4fv(GLES20.glGetUniformLocation(marker,"mvp"),1,false,mvp,0);int p=GLES20.glGetAttribLocation(marker,"p");GLES20.glEnableVertexAttribArray(p);GLES20.glVertexAttribPointer(p,3,GLES20.GL_FLOAT,false,0,buffer(positions));GLES20.glDrawArrays(GLES20.GL_POINTS,0,points.size());if(points.size()>1)GLES20.glDrawArrays(points.size()>2?GLES20.GL_LINE_LOOP:GLES20.GL_LINE_STRIP,0,points.size());GLES20.glDisableVertexAttribArray(p);
    }
}
