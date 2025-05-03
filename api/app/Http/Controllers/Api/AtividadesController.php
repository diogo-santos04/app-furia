<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Atividades; // Modelo correto (Atividades)

class AtividadesController extends Controller
{
    // GET /atividade
    public function index()
    {
        return response()->json(Atividades::all());
    }

    // POST /atividade
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

        $atividade = Atividades::create([
            'user_id' => $request->input('user_id'),
            'nome' => json_encode($request->input('nome')), // <-- transformando array em JSON
        ]);

        return response()->json($atividade, 201);
    }



    // PUT/PATCH /atividade/{id}
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

        $atividade = Atividades::find($id);

        if (!$atividade) {
            return response()->json(['error' => 'Atividade não encontrada'], 404);
        }

        $atividade->update([
            'user_id' => $request->input('user_id'),
            'nome' => $request->input('nome'),
        ]);

        return response()->json($atividade);
    }

    // DELETE /atividade/{id}
    public function destroy($id)
    {
        $atividade = Atividades::find($id);

        if (!$atividade) {
            return response()->json(['error' => 'Atividade não encontrada'], 404);
        }

        $atividade->delete();

        return response()->json(['success' => true]);
    }
}
