<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Eventos;

class EventosController extends Controller
{
    // GET /evento
    public function index()
    {
        return response()->json(Eventos::all());
    }

    // POST /evento
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'nome' => 'required|array|min:1',
            'nome.*' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $evento = Eventos::create([
            'user_id' => $request->input('user_id'),
            'nome' => json_encode($request->input('nome')),
        ]);

        return response()->json($evento, 201);
    }

    // GET /evento/{id}
    public function show($id)
    {
        $evento = Eventos::find($id);

        if (!$evento) {
            return response()->json(['error' => 'Evento não encontrado'], 404);
        }

        return response()->json($evento);
    }

    // PUT/PATCH /evento/{id}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'nome' => 'required|array|min:1',
            'nome.*' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $evento = Eventos::find($id);

        if (!$evento) {
            return response()->json(['error' => 'Evento não encontrado'], 404);
        }

        $evento->update([
            'user_id' => $request->input('user_id'),
            'nome' => $request->input('nome'),
        ]);

        return response()->json($evento);
    }

    // DELETE /evento/{id}
    public function destroy($id)
    {
        $evento = Eventos::find($id);

        if (!$evento) {
            return response()->json(['error' => 'Evento não encontrado'], 404);
        }

        $evento->delete();

        return response()->json(['success' => true]);
    }
}
