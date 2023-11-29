//
//  vivavitalApp.swift
//  vivavital
//
//  Created by Sahil Deshpande on 29/10/23.
//

import SwiftUI
import BackgroundTasks

// Define a separate object to handle background tasks
struct BackgroundTaskHandler {
    static func handleAppRefresh(task: BGAppRefreshTask) {
        // Schedule a new fetch operation for the next time the app is in the background.
        scheduleBackgroundHealthKitFetch()
        print("scheduleBackgroundHealthKitFetch ran")
        task.expirationHandler = {
            print("Background task expired by the system")
        }
        
        HealthKitManager.shared.fetchAllData { data, error in
            guard let data = data, error == nil else {
                task.setTaskCompleted(success: false)
                return
            }
            
            print("Sending background data to server: \(data)")
            
            HealthKitManager.shared.sendDataToServer(data: data) { success, error in
                task.setTaskCompleted(success: success)
            }
        }
    }
    
    static func scheduleBackgroundHealthKitFetch() {
        let request = BGAppRefreshTaskRequest(identifier: "com.vivavital.healthkit.backgroundfetch")
        request.earliestBeginDate = Date(timeIntervalSinceNow: 20) // Schedule to start in one hour.
        print("Background Task Scheduled")
        
        do {
            try BGTaskScheduler.shared.submit(request)
            print("BGTaskScheduler Successful")
        } catch {
            print("Could not schedule app refresh: \(error)")
        }
    }
}

@main
struct vivavitalApp: App {
    @Environment(\.scenePhase) private var scenePhase
    
    init() {
        
        HealthKitManager.shared.establishWebSocketConnection()  // Establish WebSocket connection
        // Register your background task here
        BGTaskScheduler.shared.register(forTaskWithIdentifier: "com.vivavital.healthkit.backgroundfetch", using: nil) { task in
            // Call the static method on BackgroundTaskHandler instead of self
            BackgroundTaskHandler.handleAppRefresh(task: task as! BGAppRefreshTask)
        }
        
    }
    
    
    var body: some Scene {
        WindowGroup {
            ContentView()
            .onAppear {
                HealthKitManager.shared.requestPermissions { success, error in
                    if success {
                        HealthKitManager.shared.fetchAllData { data, error in
                            if let error = error {
                                print("Error fetching health data: \(error)")
                            } else if let data = data {
                                print("Health data fetched successfully")
                                
                                // Send the data as JSON string
                                HealthKitManager.shared.sendDataToServer(data: data) { success, error in
                                    if success {
                                        print("Health data sent to server successfully")
                                    } else if let error = error {
                                        print("Failed to send HealthData: \(error)")
                                    }
                                }
                            }
                        }
                    } else if let error = error {
                        print("Error requesting HealthKit permissions: \(error)")
                    }
                }
            }
        }
        
        .onChange(of: scenePhase) { newScenePhase in
            switch newScenePhase {
            case .active:
                print("App is active")
            case .inactive:
                print("App is inactive")
            case .background:
                print("App is in background")
                BackgroundTaskHandler.scheduleBackgroundHealthKitFetch()
            @unknown default:
                print("Unknown scene phase")
            }
        }

    }
}
