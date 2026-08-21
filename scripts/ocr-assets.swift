import Foundation
import Vision
import AppKit

let args = Array(CommandLine.arguments.dropFirst())
for p in args {
    guard let img = NSImage(contentsOfFile: p),
          let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = false
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
    let text = (req.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: " ")
    if !text.isEmpty {
        print("\(p)\t\(text.replacingOccurrences(of: "\n", with: " "))")
    }
}
