import SwiftUI
import HealthKit

extension Color {
    static let primaryColor = Color("#FFFFFF")
    static let accentColor = Color("#E3FA94")
}



extension Font {
    static let customTitle = Font.custom("CircularStd-Bold", size: 24)
    static let customBody = Font.custom("CircularStd-Regular", size: 16)
}


struct ContentView: View {
    
    @State private var isAuthorized = false
    
    var body: some View {
        
        NavigationStack{
            TabView {
                
                MetricsView(title: "Today", period: .today)
                    .tabItem {
                        Label("Today", systemImage: "sun.max")
                    }
                
                MetricsView(title: "Past Week", period: .week)
                    .tabItem {
                        Label("Past Week", systemImage: "calendar")
                    }
                
                MetricsView(title: "Total", period: .total)
                    .tabItem {
                        Label("Total", systemImage: "list.dash")
                    }
                
            }
        }
        
        .onAppear {
                    HealthKitManager.shared.requestAuthorization { (success, error) in
                        self.isAuthorized = success
                        if let error = error {
                            print("Error requesting HealthKit permissions: \(error)")
                        }
                    }
                }
    }
}

struct MetricsView: View {
    enum Period {
        case total, week, today
    }

    let title: String
    let period: Period

    @State private var steps: Double = 0
    @State private var distance: Double = 0
    @State private var calories: Double = 0
    @State private var sleep: Double = 0

    var body: some View {
        VStack{
            Spacer()
            ScrollView{
                Text("\(title) Steps: \(steps, specifier: "%.0f") steps")
                Text("\(title) Distance: \(distance, specifier: "%.2f") meters")
                Text("\(title) Calories Burned: \(calories, specifier: "%.0f") calories")
                Text("\(title) Sleep: \(sleep / 3600, specifier: "%.2f") hours")
            }
            .frame(maxWidth: .infinity)
            Spacer()
        }
        .padding()
        .onAppear{
            loadData()
        }
    }

    private func loadData() {
        switch period {
        case .total:
            HealthKitManager.shared.fetchTotalSteps { (result, error) in
                self.steps = result ?? 0
            }
            HealthKitManager.shared.fetchTotalDistance { (result, error) in
                self.distance = result ?? 0
            }
            HealthKitManager.shared.fetchTotalCaloriesBurned { (result, error) in
                self.calories = result ?? 0
            }
            HealthKitManager.shared.fetchTotalSleep { (result, error) in
                self.sleep = result ?? 0
            }
        case .week:
            HealthKitManager.shared.fetchStepsForPastWeek { (result, error) in
                self.steps = result ?? 0
            }
            HealthKitManager.shared.fetchDistanceForPastWeek { (result, error) in
                self.distance = result ?? 0
            }
            HealthKitManager.shared.fetchCaloriesBurnedForPastWeek { (result, error) in
                self.calories = result ?? 0
            }
            HealthKitManager.shared.fetchSleepForPastWeek { (result, error) in
                self.sleep = result ?? 0
            }
        case .today:
            HealthKitManager.shared.fetchStepsForToday { (result, error) in
                self.steps = result ?? 0
            }
            HealthKitManager.shared.fetchDistanceForToday { (result, error) in
                self.distance = result ?? 0
            }
            HealthKitManager.shared.fetchCaloriesBurnedForToday { (result, error) in
                self.calories = result ?? 0
            }
            HealthKitManager.shared.fetchSleepForToday { (result, error) in
                self.sleep = result ?? 0
            }
        }
    }

}

struct MetricView: View {
    let title: String
    let value: Double
    let unit: String

    var body: some View {
        HStack {
            Text(title)
            Spacer()
            Text("\(value, specifier: "%.2f") \(unit)")
        }
        .padding()
    }
}

struct MetricCardView: View {
    var title: String
    var value: Double
    var unit: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.customTitle)
                .foregroundColor(.primaryColor)
            
            HStack {
                Text("\(value, specifier: "%.2f")")
                    .font(.customTitle)
                    .foregroundColor(.primaryColor)
                Text(unit)
                    .font(.customBody)
                    .foregroundColor(.accentColor)
            }
        }
        
        .padding()
        .background(RoundedRectangle(cornerRadius: 15).fill(Color.white).shadow(radius: 5))
        .padding(.horizontal)
    }
    
}
