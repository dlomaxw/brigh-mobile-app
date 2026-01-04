package com.bproperties.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.NavType
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.bproperties.app.ui.PropertyDetailScreen
import com.bproperties.app.ui.LoginScreen
import com.bproperties.app.ui.SplashScreen
import com.bproperties.app.ui.PropertyDetailScreen
import com.bproperties.app.ui.PropertyScreen
import com.bproperties.app.ui.RegisterScreen
import com.bproperties.app.viewmodel.AuthViewModel
import com.bproperties.app.viewmodel.PropertyViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            com.bproperties.app.ui.theme.BPropertiesTheme {
                val navController = rememberNavController()
                // Hoist ViewModels to keep them alive and shared across screens
                val propertyViewModel: PropertyViewModel = viewModel() 
                val authViewModel: AuthViewModel = viewModel()

                NavHost(navController = navController, startDestination = "splash") {
                    composable("splash") {
                        SplashScreen(
                            onNavigateToNext = {
                                // Simple check: usually we'd check authViewModel.isLoggedIn
                                // For now, let's go to Login as default or properties if existing logic allowed
                                // Navigate to properties by default, restoring original behavior
                                navController.navigate("properties") {
                                    popUpTo("splash") { inclusive = true }
                                }
                            }
                        )
                    }
                    composable("properties") {
                        PropertyScreen(
                            viewModel = propertyViewModel,
                            onPropertyClick = { propertyId -> navController.navigate("property/$propertyId") },
                            onProfileClick = { navController.navigate("profile") }
                        )
                    }
                    composable("login") {
                        LoginScreen(
                            viewModel = authViewModel,
                            onLoginSuccess = { navController.popBackStack() },
                            onNavigateToRegister = { navController.navigate("register") }
                        )
                    }
                    composable("register") {
                        RegisterScreen(
                            viewModel = authViewModel,
                            onRegisterSuccess = { navController.popBackStack("properties", inclusive = false) },
                            onNavigateToLogin = { navController.popBackStack() }
                        )
                    }
                    composable("profile") {
                        com.bproperties.app.ui.ProfileScreen(
                            viewModel = authViewModel,
                            onNavigateToLogin = { navController.navigate("login") },
                            onNavigateToRegister = { navController.navigate("register") },
                            onNavigateToAdmin = { navController.navigate("admin") },
                            onBack = { navController.popBackStack() }
                        )
                    }
                    composable("admin") {
                        val adminViewModel: com.bproperties.app.viewmodel.AdminViewModel = viewModel()
                        com.bproperties.app.ui.AdminDashboardScreen(
                            viewModel = adminViewModel,
                            onAddProperty = { navController.navigate("add_property") },
                            onEditProperty = { propertyId -> navController.navigate("edit_property/$propertyId") },
                            onBack = { navController.popBackStack() }
                        )
                    }
                    composable("add_property") {
                        val adminViewModel: com.bproperties.app.viewmodel.AdminViewModel = viewModel()
                        com.bproperties.app.ui.AddPropertyScreen(
                            viewModel = adminViewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }
                    composable("edit_property/{propertyId}") { backStackEntry ->
                        val propertyId = backStackEntry.arguments?.getString("propertyId") ?: return@composable
                        val adminViewModel: com.bproperties.app.viewmodel.AdminViewModel = viewModel()
                        com.bproperties.app.ui.EditPropertyScreen(
                            viewModel = adminViewModel,
                            propertyId = propertyId,
                            onBack = { navController.popBackStack() }
                        )
                    }
                    composable(
                        "property/{propertyId}",
                        arguments = listOf(navArgument("propertyId") { type = NavType.StringType })
                    ) { backStackEntry ->
                        val propertyId = backStackEntry.arguments?.getString("propertyId") ?: return@composable
                        // Ideally pass propertyViewModel and use a function to select/fetch
                        PropertyDetailScreen(viewModel = propertyViewModel, propertyId = propertyId) {
                            navController.popBackStack()
                        }
                    }
                }
            }
        }
    }
}
