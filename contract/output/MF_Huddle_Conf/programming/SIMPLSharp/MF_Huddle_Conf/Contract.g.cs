using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace MF_Huddle_Conf
{
    /// <summary>
    /// Common Interface for Root Contracts.
    /// </summary>
    public interface IContract
    {
        object UserObject { get; set; }
        void AddDevice(BasicTriListWithSmartObject device);
        void RemoveDevice(BasicTriListWithSmartObject device);
    }

    /// <summary>
    /// Conference_Huddle Room CH5
    /// </summary>
    public class Contract : IContract, IDisposable
    {
        #region Components

        private ComponentMediator ComponentMediator { get; set; }

        public MF_Huddle_Conf.IPower poweron { get { return (MF_Huddle_Conf.IPower)Internalpoweron; } }
        private MF_Huddle_Conf.Power Internalpoweron { get; set; }

        public MF_Huddle_Conf.IVolume volume { get { return (MF_Huddle_Conf.IVolume)Internalvolume; } }
        private MF_Huddle_Conf.Volume Internalvolume { get; set; }

        public MF_Huddle_Conf.ISourceButtons[] source { get { return Internalsource.Cast<MF_Huddle_Conf.ISourceButtons>().ToArray(); } }
        private MF_Huddle_Conf.SourceButtons[] Internalsource { get; set; }

        public MF_Huddle_Conf.ICallButtons[] call { get { return Internalcall.Cast<MF_Huddle_Conf.ICallButtons>().ToArray(); } }
        private MF_Huddle_Conf.CallButtons[] Internalcall { get; set; }

        public MF_Huddle_Conf.ISlidersGauges shutdownprogress { get { return (MF_Huddle_Conf.ISlidersGauges)Internalshutdownprogress; } }
        private MF_Huddle_Conf.SlidersGauges Internalshutdownprogress { get; set; }

        public MF_Huddle_Conf.ITVs[] tvs { get { return Internaltvs.Cast<MF_Huddle_Conf.ITVs>().ToArray(); } }
        private MF_Huddle_Conf.TVs[] Internaltvs { get; set; }

        public MF_Huddle_Conf.INavButtons[] nav { get { return Internalnav.Cast<MF_Huddle_Conf.INavButtons>().ToArray(); } }
        private MF_Huddle_Conf.NavButtons[] Internalnav { get; set; }

        public MF_Huddle_Conf.IToggleButton[] mics { get { return Internalmics.Cast<MF_Huddle_Conf.IToggleButton>().ToArray(); } }
        private MF_Huddle_Conf.ToggleButton[] Internalmics { get; set; }

        public MF_Huddle_Conf.IToggleButton[] presets { get { return Internalpresets.Cast<MF_Huddle_Conf.IToggleButton>().ToArray(); } }
        private MF_Huddle_Conf.ToggleButton[] Internalpresets { get; set; }

        public MF_Huddle_Conf.IToggleButton[] quick { get { return Internalquick.Cast<MF_Huddle_Conf.IToggleButton>().ToArray(); } }
        private MF_Huddle_Conf.ToggleButton[] Internalquick { get; set; }

        public MF_Huddle_Conf.ISlidersGauges[] miclevel { get { return Internalmiclevel.Cast<MF_Huddle_Conf.ISlidersGauges>().ToArray(); } }
        private MF_Huddle_Conf.SlidersGauges[] Internalmiclevel { get; set; }

        public MF_Huddle_Conf.IClock clock { get { return (MF_Huddle_Conf.IClock)Internalclock; } }
        private MF_Huddle_Conf.Clock Internalclock { get; set; }

        public MF_Huddle_Conf.ISlidersGauges carousel { get { return (MF_Huddle_Conf.ISlidersGauges)Internalcarousel; } }
        private MF_Huddle_Conf.SlidersGauges Internalcarousel { get; set; }

        public MF_Huddle_Conf.ICircularPreloader circular { get { return (MF_Huddle_Conf.ICircularPreloader)Internalcircular; } }
        private MF_Huddle_Conf.CircularPreloader Internalcircular { get; set; }

        public MF_Huddle_Conf.IRadioToggle[] radio { get { return Internalradio.Cast<MF_Huddle_Conf.IRadioToggle>().ToArray(); } }
        private MF_Huddle_Conf.RadioToggle[] Internalradio { get; set; }

        #endregion

        #region Construction and Initialization

        private static readonly IDictionary<int, uint> SourceSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 3 }, { 1, 4 }, { 2, 5 }, { 3, 6 }, { 4, 7 }, { 5, 8 }};
        private static readonly IDictionary<int, uint> CallSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 9 }, { 1, 10 }, { 2, 11 }, { 3, 12 }, { 4, 13 }, { 5, 14 }};
        private static readonly IDictionary<int, uint> TvsSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 16 }, { 1, 17 }, { 2, 18 }, { 3, 19 }, { 4, 20 }, { 5, 21 }, { 6, 22 }};
        private static readonly IDictionary<int, uint> NavSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 23 }, { 1, 24 }, { 2, 25 }, { 3, 26 }, { 4, 27 }, { 5, 28 }, { 6, 29 }};
        private static readonly IDictionary<int, uint> MicsSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 30 }, { 1, 31 }, { 2, 32 }, { 3, 33 }, { 4, 34 }, { 5, 35 }};
        private static readonly IDictionary<int, uint> PresetsSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 36 }, { 1, 37 }, { 2, 38 }, { 3, 39 }, { 4, 40 }, { 5, 41 }};
        private static readonly IDictionary<int, uint> QuickSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 42 }, { 1, 43 }, { 2, 44 }};
        private static readonly IDictionary<int, uint> MiclevelSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 45 }, { 1, 46 }, { 2, 47 }, { 3, 48 }};
        private static readonly IDictionary<int, uint> RadioSmartObjectIdMappings = new Dictionary<int, uint>{
            { 0, 52 }, { 1, 53 }};

        public Contract()
            : this(new List<BasicTriListWithSmartObject>().ToArray())
        {
        }

        public Contract(BasicTriListWithSmartObject device)
            : this(new [] { device })
        {
        }

        public Contract(BasicTriListWithSmartObject[] devices)
        {
            if (devices == null)
                throw new ArgumentNullException("Devices is null");

            ComponentMediator = new ComponentMediator();

            Internalpoweron = new MF_Huddle_Conf.Power(ComponentMediator, 1);
            Internalvolume = new MF_Huddle_Conf.Volume(ComponentMediator, 2);
            Internalsource = new MF_Huddle_Conf.SourceButtons[SourceSmartObjectIdMappings.Count];
            for (int index = 0; index < SourceSmartObjectIdMappings.Count; index++)
            {
                Internalsource[index] = new MF_Huddle_Conf.SourceButtons(ComponentMediator, SourceSmartObjectIdMappings[index]);
            }
            Internalcall = new MF_Huddle_Conf.CallButtons[CallSmartObjectIdMappings.Count];
            for (int index = 0; index < CallSmartObjectIdMappings.Count; index++)
            {
                Internalcall[index] = new MF_Huddle_Conf.CallButtons(ComponentMediator, CallSmartObjectIdMappings[index]);
            }
            Internalshutdownprogress = new MF_Huddle_Conf.SlidersGauges(ComponentMediator, 15);
            Internaltvs = new MF_Huddle_Conf.TVs[TvsSmartObjectIdMappings.Count];
            for (int index = 0; index < TvsSmartObjectIdMappings.Count; index++)
            {
                Internaltvs[index] = new MF_Huddle_Conf.TVs(ComponentMediator, TvsSmartObjectIdMappings[index]);
            }
            Internalnav = new MF_Huddle_Conf.NavButtons[NavSmartObjectIdMappings.Count];
            for (int index = 0; index < NavSmartObjectIdMappings.Count; index++)
            {
                Internalnav[index] = new MF_Huddle_Conf.NavButtons(ComponentMediator, NavSmartObjectIdMappings[index]);
            }
            Internalmics = new MF_Huddle_Conf.ToggleButton[MicsSmartObjectIdMappings.Count];
            for (int index = 0; index < MicsSmartObjectIdMappings.Count; index++)
            {
                Internalmics[index] = new MF_Huddle_Conf.ToggleButton(ComponentMediator, MicsSmartObjectIdMappings[index]);
            }
            Internalpresets = new MF_Huddle_Conf.ToggleButton[PresetsSmartObjectIdMappings.Count];
            for (int index = 0; index < PresetsSmartObjectIdMappings.Count; index++)
            {
                Internalpresets[index] = new MF_Huddle_Conf.ToggleButton(ComponentMediator, PresetsSmartObjectIdMappings[index]);
            }
            Internalquick = new MF_Huddle_Conf.ToggleButton[QuickSmartObjectIdMappings.Count];
            for (int index = 0; index < QuickSmartObjectIdMappings.Count; index++)
            {
                Internalquick[index] = new MF_Huddle_Conf.ToggleButton(ComponentMediator, QuickSmartObjectIdMappings[index]);
            }
            Internalmiclevel = new MF_Huddle_Conf.SlidersGauges[MiclevelSmartObjectIdMappings.Count];
            for (int index = 0; index < MiclevelSmartObjectIdMappings.Count; index++)
            {
                Internalmiclevel[index] = new MF_Huddle_Conf.SlidersGauges(ComponentMediator, MiclevelSmartObjectIdMappings[index]);
            }
            Internalclock = new MF_Huddle_Conf.Clock(ComponentMediator, 49);
            Internalcarousel = new MF_Huddle_Conf.SlidersGauges(ComponentMediator, 50);
            Internalcircular = new MF_Huddle_Conf.CircularPreloader(ComponentMediator, 51);
            Internalradio = new MF_Huddle_Conf.RadioToggle[RadioSmartObjectIdMappings.Count];
            for (int index = 0; index < RadioSmartObjectIdMappings.Count; index++)
            {
                Internalradio[index] = new MF_Huddle_Conf.RadioToggle(ComponentMediator, RadioSmartObjectIdMappings[index]);
            }

            for (int index = 0; index < devices.Length; index++)
            {
                AddDevice(devices[index]);
            }
        }

        public static void ClearDictionaries()
        {
            SourceSmartObjectIdMappings.Clear();
            CallSmartObjectIdMappings.Clear();
            TvsSmartObjectIdMappings.Clear();
            NavSmartObjectIdMappings.Clear();
            MicsSmartObjectIdMappings.Clear();
            PresetsSmartObjectIdMappings.Clear();
            QuickSmartObjectIdMappings.Clear();
            MiclevelSmartObjectIdMappings.Clear();
            RadioSmartObjectIdMappings.Clear();

        }

        #endregion

        #region Standard Contract Members

        public object UserObject { get; set; }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            Internalpoweron.AddDevice(device);
            Internalvolume.AddDevice(device);
            for (int index = 0; index < 6; index++)
            {
                Internalsource[index].AddDevice(device);
            }
            for (int index = 0; index < 6; index++)
            {
                Internalcall[index].AddDevice(device);
            }
            Internalshutdownprogress.AddDevice(device);
            for (int index = 0; index < 7; index++)
            {
                Internaltvs[index].AddDevice(device);
            }
            for (int index = 0; index < 7; index++)
            {
                Internalnav[index].AddDevice(device);
            }
            for (int index = 0; index < 6; index++)
            {
                Internalmics[index].AddDevice(device);
            }
            for (int index = 0; index < 6; index++)
            {
                Internalpresets[index].AddDevice(device);
            }
            for (int index = 0; index < 3; index++)
            {
                Internalquick[index].AddDevice(device);
            }
            for (int index = 0; index < 4; index++)
            {
                Internalmiclevel[index].AddDevice(device);
            }
            Internalclock.AddDevice(device);
            Internalcarousel.AddDevice(device);
            Internalcircular.AddDevice(device);
            for (int index = 0; index < 2; index++)
            {
                Internalradio[index].AddDevice(device);
            }
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            Internalpoweron.RemoveDevice(device);
            Internalvolume.RemoveDevice(device);
            for (int index = 0; index < 6; index++)
            {
                Internalsource[index].RemoveDevice(device);
            }
            for (int index = 0; index < 6; index++)
            {
                Internalcall[index].RemoveDevice(device);
            }
            Internalshutdownprogress.RemoveDevice(device);
            for (int index = 0; index < 7; index++)
            {
                Internaltvs[index].RemoveDevice(device);
            }
            for (int index = 0; index < 7; index++)
            {
                Internalnav[index].RemoveDevice(device);
            }
            for (int index = 0; index < 6; index++)
            {
                Internalmics[index].RemoveDevice(device);
            }
            for (int index = 0; index < 6; index++)
            {
                Internalpresets[index].RemoveDevice(device);
            }
            for (int index = 0; index < 3; index++)
            {
                Internalquick[index].RemoveDevice(device);
            }
            for (int index = 0; index < 4; index++)
            {
                Internalmiclevel[index].RemoveDevice(device);
            }
            Internalclock.RemoveDevice(device);
            Internalcarousel.RemoveDevice(device);
            Internalcircular.RemoveDevice(device);
            for (int index = 0; index < 2; index++)
            {
                Internalradio[index].RemoveDevice(device);
            }
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            Internalpoweron.Dispose();
            Internalvolume.Dispose();
            for (int index = 0; index < 6; index++)
            {
                Internalsource[index].Dispose();
            }
            for (int index = 0; index < 6; index++)
            {
                Internalcall[index].Dispose();
            }
            Internalshutdownprogress.Dispose();
            for (int index = 0; index < 7; index++)
            {
                Internaltvs[index].Dispose();
            }
            for (int index = 0; index < 7; index++)
            {
                Internalnav[index].Dispose();
            }
            for (int index = 0; index < 6; index++)
            {
                Internalmics[index].Dispose();
            }
            for (int index = 0; index < 6; index++)
            {
                Internalpresets[index].Dispose();
            }
            for (int index = 0; index < 3; index++)
            {
                Internalquick[index].Dispose();
            }
            for (int index = 0; index < 4; index++)
            {
                Internalmiclevel[index].Dispose();
            }
            Internalclock.Dispose();
            Internalcarousel.Dispose();
            Internalcircular.Dispose();
            for (int index = 0; index < 2; index++)
            {
                Internalradio[index].Dispose();
            }
            ComponentMediator.Dispose(); 
        }

        #endregion

    }
}
