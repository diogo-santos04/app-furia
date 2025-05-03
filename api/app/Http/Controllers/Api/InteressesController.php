<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Interesses;

class InteressesController extends Controller
{
    // GET /interesse
    public function index()
    {
        return response()->json(Interesse::all());
    }

    // POST /interesse
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id', 
            'nome' => 'required|array|min:1', // Garantir que o nome seja um array
            'nome.*' => 'string|max:255', // Garantir que cada item no array seja uma string
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        // Criar o interesse com o nome sendo um array
        $interesse = Interesses::create([
            'user_id' => $request->input('user_id'),
            'nome' => $request->input('nome'), // O campo nome será um array JSON
        ]);

        return response()->json($interesse, 201);
    }

    // GET /interesse/{id}
    public function show($id)
    {
        $interesse = Interesses::find($id);

        if (!$interesse) {
            return response()->json(['error' => 'Interesse não encontrado'], 404);
        }

        return response()->json($interesse);
    }

    // PUT/PATCH /interesse/{id}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',  
            'nome' => 'required|array|min:1', // Garantir que o nome seja um array
            'nome.*' => 'string|max:255', // Garantir que cada item do array seja uma string
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $interesse = Interesses::find($id);

        if (!$interesse) {
            return response()->json(['error' => 'Interesse não encontrado'], 404);
        }

        // Atualizar o interesse com o nome sendo um array
        $interesse->update([
            'user_id' => $request->input('user_id'),
            'nome' => $request->input('nome'), // O campo nome será um array JSON
        ]);

        return response()->json($interesse);
    }

    // DELETE /interesse/{id}
    public function destroy($id)
    {
        $interesse = Interesses::find($id);

        if (!$interesse) {
            return response()->json(['error' => 'Interesse não encontrado'], 404);
        }

        $interesse->delete();

        return response()->json(['success' => true]);
    }
}
