package com.raiyan_hillol.getvehicle.screens.homeScreen.view;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.RecyclerView;
import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import com.google.android.material.navigation.NavigationView;
import com.raiyan_hillol.getvehicle.R;
import com.raiyan_hillol.getvehicle.screens.VehicleDetailsScreen.view.VehicleDetailsActivity;
import com.raiyan_hillol.getvehicle.screens.homeScreen.controller.HomeScreenController;
import com.raiyan_hillol.getvehicle.utils.NavDrawerActions;

public class HomeScreenActivity extends AppCompatActivity {
    private static final String TAG = "HomeScreenActivity";

    ActionBarDrawerToggle actionBarNavigationDrawerToggle;
    private RecyclerView homeRecycleView;
    private HomeScreenController homeScreenController;
    private NavDrawerActions navDrawerActions;

    private DrawerLayout navigationDrawerLayout;
    private NavigationView navigationView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_screen);
        initWidgets();
        setUpNavigationDrawer();
    }

    private void initWidgets() {
        homeScreenController = new HomeScreenController(this);

        homeRecycleView = findViewById(R.id.rvHomeScreenActivity);
        homeScreenController.setRecyclerViewAdapter(homeRecycleView, this);

        navDrawerActions = new NavDrawerActions(this, getSupportFragmentManager());
    }

    private void setUpNavigationDrawer() {
        navigationView = (NavigationView) findViewById(R.id.navigation_view);
        navigationDrawerLayout = findViewById(R.id.navigation_drawer_layout);

        actionBarNavigationDrawerToggle = new ActionBarDrawerToggle(this, navigationDrawerLayout, R.string.nav_open, R.string.nav_close);

        navigationDrawerLayout.addDrawerListener(actionBarNavigationDrawerToggle);

        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.itemProfile:
                        closeDrawer();
                        break;
                    case R.id.itemHome:
                        navDrawerActions.goToHomeScreen();
                        closeDrawer();
                        break;
                    case R.id.itemAbout:
                        closeDrawer();
                        break;
                    case R.id.itemLogOut:
                        closeDrawer();
                        break;
                    default:
                        break;
                }
                return true;
            }
        });

        actionBarNavigationDrawerToggle.syncState();

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

    private void closeDrawer() {
//        navigation_view.closeDrawer(GravityCompat.START);
    }

    public void startVehicleDetailActivity(String vehicleId) {
        Intent intent = new Intent(this, VehicleDetailsActivity.class);
        intent.putExtra("selected_vehicle_id", vehicleId);
        startActivity(intent);
    }

}