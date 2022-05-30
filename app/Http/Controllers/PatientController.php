<?php

namespace App\Http\Controllers;

use App\Http\Resources\PatientResource;
use App\Models\Patient;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return PatientResource::collection(Patient::where('user_id', $user->id)->orderBy('created_at', 'DESC')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreSurveyRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePatientRequest $request)
    {
        $data = $request->validated();

        $patient = Patient::create($data);

        return new PatientResource($patient);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Survey $survey
     * @return \Illuminate\Http\Response
     */
    public function show(Patient $patient, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $patient->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        return new PatientResource($patient);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Survey $survey
     * @return \Illuminate\Http\Response
     */
    public function showForGuest(Patient $patient)
    {
        if (!$patient->status) {
            return response("", 404);
        }

        $currentDate = new \DateTime();
        $expireDate = new \DateTime($patient->expire_date);
        if ($currentDate > $expireDate) {
            return response("", 404);
        }

        return new PatientResource($patient);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateSurveyRequest $request
     * @param \App\Models\Survey                     $survey
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        $data = $request->validated();

        // Update survey in the database
        $patient->update($data);

        return new PatientResource($patient);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Survey $survey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Patient $patient, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $patient->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $patient->delete();

        return response("", 204);
    }
}
