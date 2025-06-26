import './style.css';

export default function Example() {
return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Texto à esquerda */}
      <div className="space-y-6">
        <h1 className="text-4xl p-5 md:text-5xl font-bold text-gray-900 leading-tight">
          A Revolução Digital na Gestão de Pedidos.
        </h1>
        <p className="text-gray-600 text-lg">
          Otimize suas operações e veja seus pedidos fluírem como nunca antes!
          Invista agora no nosso sistema e impulsione sua eficiência.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition">
          Conhecer Planos
        </button>
      </div>

    {/* Galeria com estilo semelhante ao do site */}
     <div className="flex gap-x-0 ml-auto">
          {/* Coluna 1 */}
          <div className="flex flex-col gap-4 mt-0">
            <div className="h-80 w-40 overflow-hidden ">
              <img
                src="/src/assets/imgs/cell_inicio.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-80 w-40 overflow-hidden -mt-16">
              <img
                src="/src/assets/imgs/cell_entregues.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="flex flex-col gap-4">
            <div className="h-80 w-40 overflow-hidden mt-16">
              <img
                src="/src/assets/imgs/cell_item1.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-80 w-40 overflow-hidden -mt-9">
              <img
                src="/src/assets/imgs/cell_relatorios.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Coluna 3 */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="h-80 w-40 overflow-hidden ">
              <img
                src="/src/assets/imgs/cell_entregues_real.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-80 w-40 overflow-hidden -mt-24">
              <img
                src="/src/assets/imgs/cell_item1.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


