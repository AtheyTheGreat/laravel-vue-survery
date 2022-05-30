<?php

namespace App\Http\Controllers;

use App\Http\Resources\PatientResourceDashboard;
use App\Models\Patient;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Total Number of Surveys
        $total = Patient::query()->where('user_id', $user->id)->count();

        // Latest Survey
        $latest = Patient::query()->where('user_id', $user->id)->latest('created_at')->first();

        return [
            'totalPatients' => $total,
            'latestPatient' => $latest ? new PatientResourceDashboard($latest) : null,
        ];
    }
}
