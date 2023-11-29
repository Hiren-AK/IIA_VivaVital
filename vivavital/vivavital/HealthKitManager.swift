import HealthKit
import BackgroundTasks
import Starscream
import Foundation

class HealthKitManager: WebSocketDelegate {
    
    func didReceive(event: WebSocketEvent, client: WebSocketClient) {
        switch event {
        case .connected(let headers):
            isConnected = true
            print("WebSocket connected with headers: \(headers)")
        case .disconnected(let reason, let code):
            isConnected = false
            print("WebSocket disconnected with reason: \(reason) and code: \(code)")
        case .text(let text):
            print("Received message from server: \(text)")
        case .error(let error):
            print("WebSocket encountered an error: \(error?.localizedDescription ?? "Unknown error")")
        default:
            print("Received an unhandled event: \(event)")
        }
    }

    
    static let shared = HealthKitManager()
    private let healthStore = HKHealthStore()
    private var socket: WebSocket?
    private var isConnected = false

    
    struct HealthData: Encodable {
        var userId: Int

        // Today
        var stepsToday: Double
        var distanceToday: Double
        var caloriesToday: Double
        var sleepToday: Double

        // Past Week
        var stepsWeek: Double
        var distanceWeek: Double
        var caloriesWeek: Double
        var sleepWeek: Double

        // Total
        var stepsTotal: Double
        var distanceTotal: Double
        var caloriesTotal: Double
        var sleepTotal: Double
    }

    
    func establishWebSocketConnection() {
        let urlString = "ws://192.168.46.232:8001"
        print("Attempting to connect to WebSocket at \(urlString)")
        if let url = URL(string: urlString) {
            var request = URLRequest(url: url)
            request.timeoutInterval = 5
            socket = WebSocket(request: request)
            socket?.delegate = self
            socket?.connect()
        } else {
            print("Invalid WebSocket URL")
        }
    }

    
    func websocketDidConnect(socket: WebSocketClient) {
            print("WebSocket connected")
        }
    
    func websocketDidDisconnect(socket: WebSocketClient, error: Error?) {
            if let error = error {
                print("WebSocket disconnected with error: \(error)")
            } else {
                print("WebSocket disconnected")
            }
        }
    
    

    
    func fetchAllData(completion: @escaping (HealthData?, Error?) -> Void) {
        let group = DispatchGroup()
        // Get the current date

        var healthData = HealthData(
                userId: 1,
                stepsToday: 0.0, distanceToday: 0.0, caloriesToday: 0.0, sleepToday: 0.0,
                stepsWeek: 0.0, distanceWeek: 0.0, caloriesWeek: 0.0, sleepWeek: 0.0,
                stepsTotal: 0.0, distanceTotal: 0.0, caloriesTotal: 0.0, sleepTotal: 0.0
            )



        // Fetch Steps
        group.enter()
        fetchStepsForToday { steps, error in
                if let error = error {
                    print("Error fetching steps for today: \(error)")
                } else {
                    healthData.stepsToday = steps ?? 0
                }
                group.leave()
        }
        
        group.enter()
        fetchStepsForPastWeek { steps, error in
            healthData.stepsWeek = steps ?? 0
            group.leave()
        }
        group.enter()
        fetchTotalSteps { steps, error in
            healthData.stepsTotal = steps ?? 0
            group.leave()
        }
        
        // Fetch Distance
        group.enter()
        fetchDistanceForToday { distance, error in
            healthData.distanceToday = distance ?? 0.0
            group.leave()
        }
        group.enter()
        fetchDistanceForPastWeek { distance, error in
            healthData.distanceWeek = distance ?? 0.0
            group.leave()
        }
        group.enter()
        fetchTotalDistance { distance, error in
            healthData.distanceTotal = distance ?? 0.0
            group.leave()
        }
        
        // Fetch Calories Burned
        // Similar structure as for steps, but for calories burned
        group.enter()
        fetchCaloriesBurnedForToday { calories, error in
            healthData.caloriesToday = calories ?? 0.0
            group.leave()
        }
        group.enter()
        fetchCaloriesBurnedForPastWeek { calories, error in
            healthData.caloriesWeek = calories ?? 0.0
            group.leave()
        }
        group.enter()
        fetchTotalCaloriesBurned { calories, error in
            healthData.caloriesTotal = calories ?? 0.0
            group.leave()
        }
        
        // Fetch Sleep Duration and Quality
        // Similar structure as for steps, but for sleep duration and quality
        group.enter()
        fetchSleepForToday { duration, error in
            if let durationInSeconds = duration {
                healthData.sleepToday = Double(durationInSeconds) / 3600.0 // Convert seconds to hours
            } else {
                healthData.sleepToday = 0.0 // Set to 0 if data is nil
            }
            group.leave()
        }

        group.enter()
        fetchSleepForPastWeek { duration, error in
            if let durationInSeconds = duration {
                healthData.sleepWeek = Double(durationInSeconds) / 3600.0 // Convert seconds to hours
            } else {
                healthData.sleepWeek = 0.0 // Set to 0 if data is nil
            }
            group.leave()
        }

        group.enter()
        fetchTotalSleep { duration, error in
            if let durationInSeconds = duration {
                healthData.sleepTotal = Double(durationInSeconds) / 3600.0 // Convert seconds to hours
            } else {
                healthData.sleepTotal = 0.0 // Set to 0 if data is nil
            }
            group.leave()
        }
        group.notify(queue: .main) {
            print("All health data fetched")
            completion(healthData, nil)
        }
    }

    // Check if HealthKit is available on the device
    func isHealthKitAvailable() -> Bool {
        return HKHealthStore.isHealthDataAvailable()
    }

    // Request permissions
    func requestPermissions(completion: @escaping (Bool, Error?) -> Void) {
        guard isHealthKitAvailable() else {
            completion(false, nil)
            return
        }

        // Define the data types you want to access
        let typesToShare: Set = [
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        ]

        let typesToRead: Set = [
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        ]

        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { (success, error) in
            completion(success, error)
        }
    }
    
    func requestAuthorization(completion: @escaping (Bool, Error?) -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else {
            completion(false, nil)
            return
        }

        let readTypes: Set = [
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        ]

        let writeTypes: Set<HKSampleType> = [] // Add any types you want to write to HealthKit, if any.

        healthStore.requestAuthorization(toShare: writeTypes, read: readTypes) { (success, error) in
            completion(success, error)
        }
    }

    
    private func fetchQuantity(for typeIdentifier: HKQuantityTypeIdentifier, unit: HKUnit, period: DateComponents? = nil, completion: @escaping (Double?, Error?) -> Void) {
        guard let type = HKObjectType.quantityType(forIdentifier: typeIdentifier) else {
            completion(nil, nil)
            return
        }

        var predicate: NSPredicate? = nil
        if let period = period, let startDate = Calendar.current.date(byAdding: period, to: Date()) {
            predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date(), options: [])
        }

        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { (_, result, error) in
            guard let result = result, let sum = result.sumQuantity() else {
                completion(nil, error)
                return
            }
            
            completion(sum.doubleValue(for: unit), nil)
        }
        healthStore.execute(query)
    }
    
    // Steps
    func fetchTotalSteps(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .stepCount, unit: HKUnit.count(), completion: completion)
    }

    func fetchStepsForPastWeek(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .stepCount, unit: HKUnit.count(), period: DateComponents(day: -7), completion: completion)
    }

    func fetchStepsForToday(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .stepCount, unit: HKUnit.count(), period: DateComponents(day: -1), completion: completion)
    }

    // Distance
    func fetchTotalDistance(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .distanceWalkingRunning, unit: HKUnit.meter(), completion: completion)
    }

    func fetchDistanceForPastWeek(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .distanceWalkingRunning, unit: HKUnit.meter(), period: DateComponents(day: -7), completion: completion)
    }

    func fetchDistanceForToday(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .distanceWalkingRunning, unit: HKUnit.meter(), period: DateComponents(day: -1), completion: completion)
    }

    // Calories Burned
    func fetchTotalCaloriesBurned(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .activeEnergyBurned, unit: HKUnit.kilocalorie(), completion: completion)
    }

    func fetchCaloriesBurnedForPastWeek(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .activeEnergyBurned, unit: HKUnit.kilocalorie(), period: DateComponents(day: -7), completion: completion)
    }

    func fetchCaloriesBurnedForToday(completion: @escaping (Double?, Error?) -> Void) {
        fetchQuantity(for: .activeEnergyBurned, unit: HKUnit.kilocalorie(), period: DateComponents(day: -1), completion: completion)
    }
    
    func fetchTotalSleep(completion: @escaping (Double?, Error?) -> Void) {
            let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
            let query = HKSampleQuery(sampleType: sleepType, predicate: nil, limit: Int(HKObjectQueryNoLimit), sortDescriptors: nil) { (query, samples, error) in
                guard error == nil else {
                    completion(nil, error)
                    return
                }

                let totalSleep = samples?.compactMap { sample in
                    return (sample.endDate.timeIntervalSince(sample.startDate))
                }.reduce(0, +)

                completion(totalSleep, nil)
            }

            healthStore.execute(query)
    }
    
    func fetchSleepForPastWeek(completion: @escaping (Double?, Error?) -> Void) {
            let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
            let predicate = HKQuery.predicateForSamples(withStart: Calendar.current.date(byAdding: .day, value: -7, to: Date()), end: Date(), options: [])
            let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: Int(HKObjectQueryNoLimit), sortDescriptors: nil) { (query, samples, error) in
                guard error == nil else {
                    completion(nil, error)
                    return
                }

                let totalSleep = samples?.compactMap { sample in
                    return (sample.endDate.timeIntervalSince(sample.startDate))
                }.reduce(0, +)

                completion(totalSleep, nil)
            }

            healthStore.execute(query)
        }
    
    func fetchSleepForToday(completion: @escaping (Double?, Error?) -> Void) {
            let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
            let predicate = HKQuery.predicateForSamples(withStart: Calendar.current.startOfDay(for: Date()), end: Date(), options: [])
            let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: Int(HKObjectQueryNoLimit), sortDescriptors: nil) { (query, samples, error) in
                guard error == nil else {
                    completion(nil, error)
                    return
                }

                let totalSleep = samples?.compactMap { sample in
                    return (sample.endDate.timeIntervalSince(sample.startDate))
                }.reduce(0, +)

                completion(totalSleep, nil)
            }
            healthStore.execute(query)
        }
    
    func sendDataToServer(data: HealthData, completion: @escaping (Bool, Error?) -> Void) {
        do {
            let jsonData = try JSONEncoder().encode(data)
            guard let jsonString = String(data: jsonData, encoding: .utf8) else {
                print("Failed to encode HealthData to JSON")
                completion(false, nil)
                return
            }
            
            print("Sending data to server: \(jsonString)")
            socket?.write(string: jsonString) {
                print("Health data sent successfully over WebSocket")
                completion(true, nil)
            }
        } catch {
            print("Failed to encode HealthData to JSON: \(error)")
            completion(false, error)
        }
    }
    
    func saveHealthDataToFile(data: HealthData, completion: @escaping (Bool, URL?, Error?) -> Void) {
        do {
            let jsonData = try JSONEncoder().encode(data)
            let filename = getDocumentsDirectory().appendingPathComponent("health_data.json")
            try jsonData.write(to: filename, options: .atomicWrite)
            print("Health data saved to \(filename)")
            completion(true, filename, nil)
        } catch {
            print("Failed to save HealthData to file: \(error)")
            completion(false, nil, error)
        }
    }

    private func getDocumentsDirectory() -> URL {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths[0]
    }
}
