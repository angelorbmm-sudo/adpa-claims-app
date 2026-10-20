import UIKit
import RoomPlan
import AVFoundation

final class CaptureViewController: UIViewController, RoomCaptureViewDelegate {
    private let capture = RoomCaptureView(frame:.zero)
    private let name = UITextField()
    private let status = UILabel()
    private let start = UIButton(type:.system)
    private let stop = UIButton(type:.system)
    private let export = UIButton(type:.system)
    private let raw = UIButton(type:.system)
    private var result: CapturedRoom?
    private var scanning = false
    override func viewDidLoad() {
        super.viewDidLoad(); title="ADPA Room Capture"; view.backgroundColor = .systemBackground
        name.placeholder="Room name";name.text="Room 1";name.borderStyle = .roundedRect
        status.numberOfLines=0;status.font = .systemFont(ofSize:13)
        status.text="Development scanner: verify every measurement in ADPA. Capture materials and damage in the ADPA evidence workflow. Nothing uploads automatically."
        start.setTitle("Start RoomPlan scan",for:.normal);start.addTarget(self,action:#selector(beginScan),for:.touchUpInside)
        stop.setTitle("Stop & process",for:.normal);stop.addTarget(self,action:#selector(endScan),for:.touchUpInside)
        export.setTitle("Export ADPA scan JSON",for:.normal);export.addTarget(self,action:#selector(exportScan),for:.touchUpInside)
        raw.setTitle("Export original RoomPlan JSON",for:.normal);raw.addTarget(self,action:#selector(exportRaw),for:.touchUpInside)
        stop.isEnabled=false;export.isEnabled=false;raw.isEnabled=false;capture.delegate=self
        let controls=UIStackView(arrangedSubviews:[name,status,start,stop,export,raw]);controls.axis = .vertical;controls.spacing=7
        let stack=UIStackView(arrangedSubviews:[capture,controls]);stack.axis = .vertical;stack.spacing=8;stack.translatesAutoresizingMaskIntoConstraints=false
        view.addSubview(stack)
        NSLayoutConstraint.activate([stack.topAnchor.constraint(equalTo:view.safeAreaLayoutGuide.topAnchor),stack.bottomAnchor.constraint(equalTo:view.safeAreaLayoutGuide.bottomAnchor,constant:-12),stack.leadingAnchor.constraint(equalTo:view.leadingAnchor,constant:16),stack.trailingAnchor.constraint(equalTo:view.trailingAnchor,constant:-16),capture.heightAnchor.constraint(greaterThanOrEqualToConstant:180)])
        if !RoomCaptureSession.isSupported {start.isEnabled=false;status.text="This device does not support RoomPlan. Use the ADPA camera and manual measurement workflow."}
    }
    @objc private func beginScan() {
        guard RoomCaptureSession.isSupported else {return}
        AVCaptureDevice.requestAccess(for:.video) { [weak self] allowed in DispatchQueue.main.async {
            guard let self=self else{return}
            guard allowed else{self.status.text="Camera permission is required. You can still use entered measurements in ADPA.";return}
            self.result=nil;self.export.isEnabled=false;self.raw.isEnabled=false
            self.capture.captureSession.run(configuration:RoomCaptureSession.Configuration())
            self.scanning=true;self.start.isEnabled=false;self.stop.isEnabled=true;self.status.text="Move slowly around one room. Stop when its walls and openings have been captured."
        }}
    }
    @objc private func endScan() {guard scanning else{return};capture.captureSession.stop();scanning=false;stop.isEnabled=false;status.text="Processing room…"}
    func captureView(shouldPresent roomDataForProcessing:CapturedRoomData,error:Error?) -> Bool {
        if let error=error {DispatchQueue.main.async{self.failed(error)};return false};return true
    }
    func captureView(didPresent processedResult:CapturedRoom,error:Error?) {
        DispatchQueue.main.async {
            if let error=error {self.failed(error);return}
            self.result=processedResult;self.start.isEnabled=true;self.stop.isEnabled=false;self.export.isEnabled=true;self.raw.isEnabled=true
            self.status.text="Candidate geometry captured. Export the ADPA scan and original RoomPlan JSON. Import only the ADPA scan into Inspection & Scope; review its outline, height and opening deductions."
        }
    }
    private func failed(_ error:Error){scanning=false;start.isEnabled=true;stop.isEnabled=false;status.text=error.localizedDescription}
    private func share(_ files:[URL]) {
        let controller=UIActivityViewController(activityItems:files,applicationActivities:nil)
        controller.popoverPresentationController?.sourceView=export
        present(controller,animated:true)
    }
    @objc private func exportScan() {
        guard let room=result else{return}
        let roomName=name.text?.trimmingCharacters(in:.whitespacesAndNewlines) ?? ""
        guard !roomName.isEmpty,roomName.count<=150 else{status.text="Enter a room name of 1-150 characters.";return}
        let confirmation=UIAlertController(title:"Confirm room geometry",message:"This adapter supports a single room with straight vertical walls and a level ceiling. Inspect the result and verify all measurements in ADPA before using them. Otherwise export the original source and measure manually.",preferredStyle:.alert)
        confirmation.addAction(UIAlertAction(title:"Cancel",style:.cancel))
        confirmation.addAction(UIAlertAction(title:"Export candidate",style:.default){_ in
            do {let scan=try ScanExport.envelope(room:room,name:roomName);self.share([try ScanExport.write(scan,filename:"adpa-scan.json"),try ScanExport.write(room,filename:"roomplan-original.json")])}
            catch{self.status.text=error.localizedDescription}
        });present(confirmation,animated:true)
    }
    @objc private func exportRaw() {guard let room=result else{return};do{share([try ScanExport.write(room,filename:"roomplan-original.json")])}catch{status.text=error.localizedDescription}}
    override func viewWillDisappear(_ animated:Bool){super.viewWillDisappear(animated);if scanning{capture.captureSession.stop();scanning=false;start.isEnabled=true;stop.isEnabled=false}}
}
