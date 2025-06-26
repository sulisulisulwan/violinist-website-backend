
class TempDb {

  protected data: any
  protected idCounter: number
  protected pieces: any
  protected programs: any

  /**
   * PIECES
   * id: number
   * name: string
   * detailedName: string
   * composer: string
   * arranger: string
   * type: string (concerto, recital, chamberMusic)
   * 
   * 
   * PROGRAMPIECE
   * id
   * programId
   * position
   * pieceId
   * 
   * 
   * PROGRAMS
   * id
   * name
   * description
   * 
   */


  constructor() {

    this.idCounter = 3

    this.pieces = {

    }

    this.data = {

      results: [
        {
          id: 1,
          name: 'Example 1',
          components: [
            { type: 'p', content: [{ type: 'text', content: "Concert violinist Suliman Tekalli''s performing as a soloist, recitalist, and chamber musician has taken him throughout the U.S., Canada, Central America, and Europe. Top prize winner of the Seoul International Music Competition in Korea, as well as first prize in the Blount National String Competition, and prizes in the 2013 Sendai International Music Competition in Japan, 2010 Lipizer International Violin Competition in Italy, 2009 Szeryng International Violin Competition in Mexico, he has appeared with orchestras such as the International Sejong Soloists, Sendai Philharmonic, and Orquesta Sinfónica del Estado de México. :)" }]}
          ]
        }, 
        {
          id: 2,
          name: 'Example 2',
          components: [
            { type: 'p', content: { type: 'text', content: "Violinist Suliman Tekalli has established his voice as an exciting and versatile concerto soloist, recitalist, and chamber musician. As the top-prize winner of the Seoul International Music Competition and prize winner in the Sendai International Music Competition, International Violin Competition \"Rudolfo Lipizer Prize\" and the Henryk Szeryng International Competition, Suliman has performed throughout the US, Canada, Central America, Europe, and Asia, appearing on the stages of Carnegie Hall, Seoul Arts Center, Wigmore Hall, and the Kennedy Center among others. His performances have been broadcasted on KBS World TV in Korea, CBC Radio 3 in Canada, and WQXR and NPR in the U.S." } },
            { type: 'p', content: { type: 'text', content: "An exponent of chamber music, Suliman has made appearances at numerous festivals, including Music@Menlo, Yellow Barn, and the Banff Centre. He has collaborated and performed with eminent musicians such as Gil Shaham, Miriam Fried, Cho-Liang Lin, Donald Weilerstein, Paul Watkins, Wu Han, David Shifrin, and Robert McDonald.  Suliman  has also served as concertmaster of numerous critically acclaimed conductorless ensembles including the Orpheus Chamber Orchestra, the Sphinx Virtuosi, and the International Sejong Soloists of which he is currently a principal member." } },
            { type: 'p', content: { type: 'text', content: "As a composer, arranger, and performer, Suliman has transcribed and orchestrated classical and contemporary works for groups such as the Grammy Award-winning Catalyst String Quartet, Carnegie Hall's Ensemble Connect, and Sejong. In 2013, he gave the world premiere of his composition \"Mephistoccata\" from his solo violin suite \“Fables\” at the Montreal International Music Competition, receiving the Maurice and Judith Kaplow Prize for Uncommon Creativity from the Cleveland Institute of Music that same year." } },
            { type: 'p', content: { type: 'text', content: "As an alumnus of Carnegie Hall's Ensemble Connect, Mr. Tekalli is a strong advocate of teaching artistry and bringing classical music to underserved communities. He served as a Teaching Artist at the Edward R. Murrow High School in Brooklyn, as well as performed and taught at numerous Title I schools throughout the NYC area. Through the auspices of the Center of Musical Excellence, he served as Artist in Residence at the State Theatre New Jersey where he brought interactive performances to grade schools of all levels, rehabilitation centers, senior homes, and homeless shelters. He continues his work through his support of projects like Chime for Children which bring musical performances to children in hospitals." } },
            { type: 'p', content: { type: 'text', content: "As a CME Artist, Suliman has appeared as a soloist performing with the Vienna International Orchestra in Austria as well as in chamber music concerts in Vienna and Prague. Recent projects have included recordings on the recently released CD CME Presents Art of Transcription, which features his own violin and piano transcriptions as well as for mixed instrumentation. He currently performs on a 2016 Joseph Curtin and resides in New York City." } },
          ]
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  getDataById(id: number) {
    const program = this.data.results.find((program: any) => {
      return program.id === id
    })
    return program
  }

  patchData(data: any) {
  
    this.data.results = this.data.results.map((program: any) => {
      if (program.id === data.id) {
        return data
      }
      return program
    })

  }

  deleteData(id: number) {
  
    this.data.results = this.data.results.filter((program: any) => {
      return program.id !== id
    })

  }

  postData(data: any) {
    data.id = this.idCounter
    this.idCounter++
    this.data.results.push(data)
  }
}

const tempDb = new TempDb()

export default tempDb